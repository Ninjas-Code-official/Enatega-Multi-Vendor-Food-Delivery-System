import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions
} from 'react-native'
import React from 'react'
import WalletScreenBg from '../../components/ScreenBackground/WalletScreenBg'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import Amount from '../../components/Amount/Amount'
import colors from '../../utilities/colors'
import styles from './style'
import DoneIcon from '../../assets/svg/doneIcon.png'
import Spinner from '../../components/Spinner/Spinner'
import { useWithdrawRequest } from './useWithdrawRequest'
import { useTranslation } from 'react-i18next'

const { height } = Dimensions.get('window')

const Withdraw = () => {
  const {
    requestSent,
    dataProfile,
    error,
    loading,
    onSubmit,
    amount,
    setAmount
  } = useWithdrawRequest()

  const { t } = useTranslation()
  return (
    <WalletScreenBg backBtn>
      {requestSent ? (
        <View style={styles.sentView}>
          <TextDefault bolder H2 center>
            {t('requestSent')}
          </TextDefault>
          <View style={styles.imageView}>
            <Image
              source={DoneIcon}
              height={30}
              width={30}
              style={styles.image}
            />
          </View>
          <TextDefault H4 center bold textColor={colors.fontSecondColor}>
            {t('withdrawlRequestSent')}
          </TextDefault>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: height * 0.7 }}>
          <KeyboardAvoidingView behavior="position" style={{ flex: 1 }}>
            <Amount
              text={t('availableAmount')}
              center
              amount={dataProfile.rider.currentWalletAmount.toFixed(2)}
            />
            <View style={styles.inputView}>
              {/* <TextInput
                placeholder="$0.00"
                value={amount}
                onChangeText={text => setAmount(parseFloat(text))}
                style={[styles.textInput, error && styles.errorInput]}
              /> */}
              <TextInput
                placeholder="$0.00"
                value={amount !== undefined ? amount : ''}
                onChangeText={text => setAmount(parseFloat(text))}
                style={[styles.textInput, error && styles.errorInput]}
              />
              <TextDefault
                style={styles.inputText}
                H4
                textColor={
                  error ? colors.textErrorColor : colors.fontSecondColor
                }>
                {amount ? '' : (error || t('enteramount'))}
              </TextDefault>
            </View>
            <View style={styles.btnView}>
              {loading ? (
                <Spinner size="small" />
              ) : (
                <TouchableOpacity
                  onPress={() => onSubmit()}
                  style={styles.btn}
                  activeOpacity={0.7}>
                  <TextDefault textColor={colors.white} center H5 bolder>
                    {t('confirmWithdraw')}
                  </TextDefault>
                </TouchableOpacity>
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      )}
    </WalletScreenBg>
  )
}

export default Withdraw
