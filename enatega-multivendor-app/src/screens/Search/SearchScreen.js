import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  ScrollView,
  RefreshControl,
  Animated,
  Platform,
  TouchableOpacity
} from 'react-native'
import { useQuery, gql } from '@apollo/client'
import { useNavigation } from '@react-navigation/native'
import Search from '../../components/Main/Search/Search'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { theme } from '../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { restaurantListPreview } from '../../apollo/queries'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Item from '../../components/Main/Item/Item'
import { LocationContext } from '../../context/Location'
import { useCollapsibleSubHeader } from 'react-navigation-collapsible'
import Spinner from '../../components/Spinner/Spinner'
import { alignment } from '../../utils/alignment'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Ionicons } from '@expo/vector-icons'
import { storeSearch, getRecentSearches, clearRecentSearches } from '../../utils/recentSearch'
import NewRestaurantCard from '../../components/Main/RestaurantCard/NewRestaurantCard'

const RESTAURANTS = gql`
  ${restaurantListPreview}
`

const SearchScreen = () => {
  const [search, setSearch] = useState('')
  const { location, setLocation } = useContext(LocationContext)
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()
  const newheaderColor = currentTheme.backgroundColor
  const [recentSearches, setRecentSearches] = useState([])

  const { data, refetch, networkStatus, loading, error } = useQuery(
    RESTAURANTS,
    {
      variables: {
        longitude: location.longitude || null,
        latitude: location.latitude || null,
        shopType: null,
        ip: null
      },
      fetchPolicy: 'network-only'
    }
  )

  useEffect(() => {
    navigation.setOptions({
      title: t('searchTitle'),
      headerTitleAlign: 'center',
      headerRight: null,
      headerTitleStyle: {
        color: currentTheme.newFontcolor,
        fontWeight: 'bold'
      },
      headerTitleContainerStyle: {
        marginTop: '2%',
        paddingLeft: scale(25),
        paddingRight: scale(25),
        height: '75%',
        marginLeft: 0
      },
      headerStyle: {
        backgroundColor: currentTheme.themeBackground,
        elevation: 0
      }
    })
  }, [navigation])

  useEffect(() => {
    getRecentSearches().then((searches) => setRecentSearches(searches))
  }, [search])

  const {
    onScroll /* Event handler */,
    containerPaddingTop /* number */,
    scrollIndicatorInsetTop /* number */
  } = useCollapsibleSubHeader()

  const restaurants = data?.nearByRestaurantsPreview?.restaurants

  const searchAllShops = (searchText) => {
    const data = []
    const regex = new RegExp(searchText, 'i')
    restaurants?.forEach((restaurant) => {
      const resultCatFoods = restaurant.keywords.some((keyword) => {
        const result = keyword.search(regex)
        return result > -1
      })
      if (resultCatFoods) data.push(restaurant)
    })
    return data
  }

  function getUniqueTags(restaurants) {
    const allTags = new Set()
    restaurants?.forEach((restaurant) => {
      restaurant?.tags.forEach((tag) => allTags.add(tag))
    })
    return Array.from(allTags) // Convert Set back to an array
  }

  const uniqueTags = getUniqueTags(restaurants)

  const emptyView = () => {
    return (
      <View style={styles(currentTheme).emptyViewContainer}>
        <View style={styles(currentTheme).emptyViewBox}>
          <TextDefault textColor={currentTheme.fontGrayNew} center>
            {t('noResults')}
          </TextDefault>
        </View>
      </View>
    )
    // }
  }

  const handleTagPress = (tag) => {
    setSearch(tag)
  }
  
  const handleClearRecentSearches = async () => {
    try {
      await clearRecentSearches();
      setRecentSearches([]); // Update state with empty array
    } catch (error) {
      console.log('Error clearing searches:', error);
    }
  };
  
  const renderTagsOrSearches = () => {
    if (search) {
      return (
        <View style={styles().searchList}>
          <Animated.FlatList
            contentInset={{
              top: containerPaddingTop
            }}
            contentContainerStyle={{
              paddingTop: Platform.OS === 'ios' ? 0 : containerPaddingTop
            }}
            contentOffset={{
              y: -containerPaddingTop
            }}
            onScroll={onScroll}
            scrollIndicatorInsets={{
              top: scrollIndicatorInsetTop
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={emptyView()}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                progressViewOffset={containerPaddingTop}
                colors={[currentTheme.iconColorPink]}
                refreshing={networkStatus === 4}
                onRefresh={() => {
                  if (networkStatus === 7) {
                    refetch()
                  }
                }}
              />
            }
            data={searchAllShops(search)}
            renderItem={({ item }) => {
              return (
                <NewRestaurantCard
                  {...item}
                  isSearch={search}
                />
              )
            }}
          />
        </View>
      )
    } else if (recentSearches.length > 0) {
      return (
        <View style={styles(currentTheme).recentSearchContainer}>
          <View style={styles(currentTheme).flexRow}>
            <View>
              <TextDefault
                style={styles().drawerContainer}
                textColor={currentTheme.fontMainColor}
                small
                H4
                bolder
              >
                {t('recentSearches')}
              </TextDefault>
            </View>
            <View>
              <TouchableOpacity onPress={() => handleClearRecentSearches()}>
                <TextDefault
                  style={styles().drawerContainer}
                  textColor={currentTheme.fontMainColor}
                  normal
                  bolder
                >
                  {t('clear')}
                </TextDefault>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles().line} />

          {/* recent seareches list */}

          {recentSearches.map((recentSearch, index) => (
            <React.Fragment key={index}>
              <TouchableOpacity
                onPress={() => handleTagPress(recentSearch)}
                style={styles(currentTheme).recentListBtn}
              >
                <View>
                  <Ionicons
                    name='search'
                    color={currentTheme.gray500}
                    size={scale(20)}
                  />
                </View>
                <View style={{ ...alignment.MLxSmall }}>
                  <TextDefault>{recentSearch}</TextDefault>
                </View>
              </TouchableOpacity>

              <View style={styles().line} />
            </React.Fragment>
          ))}
        </View>
      )
    } else {
      return (
        <View style={styles(currentTheme).tagView}>
          {loading ? (
            <View style={{ ...alignment.MTmedium }}>
              <Spinner
                size={'small'}
                backColor={'transparent'}
                spinnerColor={currentTheme.main}
              />
            </View>
          ) : (
            uniqueTags.map((tag) => (
              <TouchableOpacity key={tag} onPress={() => handleTagPress(tag)}>
                <View style={styles(currentTheme).tagItem}>
                  <TextDefault>{tag}</TextDefault>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      )
    }
  }

  return (
    <View style={styles(currentTheme).flex}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            colors={[currentTheme.iconColorPink]}
            refreshing={networkStatus === 4}
            onRefresh={() => {
              if (networkStatus === 7) {
                refetch()
              }
            }}
          />
        }
      >
        <View style={styles().searchbar}>
          <Search
            setSearch={setSearch}
            search={search}
            newheaderColor={newheaderColor}
            placeHolder={t('searchRestaurant')}
          />
        </View>
        {renderTagsOrSearches()}
      </ScrollView>
    </View>
  )
}

export default SearchScreen
