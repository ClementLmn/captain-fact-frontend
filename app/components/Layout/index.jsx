import React, {Component} from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Helmet } from 'react-helmet'

import i18n from '../../i18n/i18n'
import { FlashMessages } from '../Utils'
import { fetchCurrentUser } from '../../state/users/current_user/effects'
import Menu from './Menu'
import IconsSet from '../Icons/IconsSet'
import { MainModalContainer } from '../Modal/MainModalContainer'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'


@connect(state => ({
  locale: state.UserPreferences.locale,
  sidebarExpended: state.UserPreferences.sidebarExpended
}), {fetchCurrentUser})

export default class App extends Component {
  componentDidMount() {
    this.props.fetchCurrentUser()
  }

  render() {
    const {locale, sidebarExpended, children} = this.props
    const mainContainerClass = sidebarExpended ? undefined : 'expended'

    return (
      <I18nextProvider i18n={i18n}>
        <div className='new-app' lang={locale}>
          <Helmet>
            <title>CaptainFact</title>
          </Helmet>
          <MainModalContainer/>
          <FlashMessages/>
          <Menu/>
          <div id="main-wrapper" className={mainContainerClass}>
            {children}
          </div>
          <PublicAchievementUnlocker achievementId={4} meetConditionsFunc={this.checkExtensionInstall}/>
          <IconsSet/>
        </div>
      </I18nextProvider>
    )
  }

  /**
   * Extension content scripts load after CaptainFact. We could have created a message
   * interface to communicate between the two but as our need is very basic for now
   * (detecting if extension is installed) we wait 5 seconds and check.
   * @returns {Promise}
   */
  checkExtensionInstall() {
    return new Promise(fulfill => {
      setTimeout(() => fulfill(!!document.getElementById('captainfact-extension-installed')), 5000)
    })
  }
}
