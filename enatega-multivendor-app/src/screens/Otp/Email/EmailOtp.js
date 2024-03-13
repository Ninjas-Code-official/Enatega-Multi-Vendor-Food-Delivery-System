import React, { useLayoutEffect } from 'react'
import { View, TouchableOpacity, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from '../styles'
import Spinner from '../../../components/Spinner/Spinner'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import screenOptions from '../screenOptions'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import useEmailOtp from './useEmailOtp'
import { useTranslation } from 'react-i18next'
import { SimpleLineIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { scale } from '../../../utils/scaling'

function EmailOtp(props) {
  const {
    otp,
    setOtp,
    otpError,
    seconds,
    loading,
    updateUserLoading,
    onCodeFilled,
    resendOtp,
    currentTheme,
    themeContext
  } = useEmailOtp()

  const route = useRoute()
  const userData = route.params?.user

  const { t } = useTranslation()
  useLayoutEffect(() => {
    props.navigation.setOptions(
      screenOptions({
        iconColor: currentTheme.iconColorPink,
        backColor: currentTheme.themeBackground,
        fontColor: currentTheme.fontMainColor,
        navigation: props.navigation
      })
    )
  }, [props.navigation])

  return (
    <SafeAreaView style={styles(currentTheme).safeAreaViewStyles}>
      <StatusBar
        backgroundColor={currentTheme.themeBackground}
        barStyle={
          themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
        }
      />
      <View style={styles(currentTheme).mainContainer}>
        <View style={styles().subContainer}>
          <View style={styles().logoContainer}>
            {/* <Image
              source={require('../../../../assets/login-icon.png')}
              style={styles().logoContainer}
            /> */}
            <SimpleLineIcons name="envelope" size={30} color="black" />
          </View>
          <View>
            <TextDefault
              H3
              bolder
              textColor={currentTheme.fontfourthColor}
              style={{
                ...alignment.MTlarge,
                ...alignment.MBmedium
              }}>
              {t('verifyEmail')}
            </TextDefault>
            <TextDefault
              H5
              bold
              textColor={currentTheme.fontSecondColor}
              style={{
                paddingBottom: scale(5)
              }}>
              {t('otpSentToEmail')}
            </TextDefault>
            <TextDefault H5 bold textColor={currentTheme.fontfourthColor}>
              {userData.email}
            </TextDefault>
          </View>
          <View>
            <OTPInputView
              pinCount={6}
              style={styles().otpInput}
              codeInputFieldStyle={[
                styles().otpBox,
                otpError && styles(currentTheme).errorInput
              ]}
              codeInputHighlightStyle={{
                borderColor: currentTheme.main
              }}
              autoFocusOnLoad
              code={otp}
              onCodeChanged={code => setOtp(code)}
              onCodeFilled={code => {
                onCodeFilled(code)
              }}
              editable
            />
            {otpError && (
              <TextDefault
                style={styles(currentTheme).error}
                bold
                textColor={currentTheme.textErrorColor}>
                {t('wrongOtp')}
              </TextDefault>
            )}
          </View>
        </View>
        <View
          style={{
            ...alignment.MTlarge,
            ...alignment.MTlarge,
            width: '100%',
            marginBottom: 20
          }}>
          <View style={alignment.MBxSmall}>
            <TextDefault
              center
              H4
              bold
              style={alignment.MTsmall}
              textColor={currentTheme.fontNewColor}>
              {seconds === 0 ? '' : `Retry after ${seconds}s`}
            </TextDefault>
          </View>
          {loading || updateUserLoading ? (
            <Spinner backColor="transparent" size="small" />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles(currentTheme).btn,
                seconds !== 0 && styles(currentTheme).disabledBtn
              ]}
              disabled={seconds !== 0}
              onPress={() => resendOtp()}>
              <TextDefault H4 textColor={currentTheme.fontFourthColor} bold>
                {t('resendBtn')}
              </TextDefault>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
export default EmailOtp
