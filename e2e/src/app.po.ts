import { browser, by, element } from 'protractor';
/**
 * app page
 * @export
 * @class AppPage
 */
export class AppPage {

  /**
   * navigate to destination
   * @param {*} destination
   * @returns
   * @memberof AppPage
   */
  navigateTo(destination) {
    return browser.get(destination);
  }

  /**
   * get title from browser
   * @returns
   * @memberof AppPage
   */
  getTitle() {
    return browser.getTitle();
  }

  /**
   * get page title text
   * @returns
   * @memberof AppPage
   */
  getPageOneTitleText() {
    return element(by.tagName('app-home')).element(by.deepCss('ion-title')).getText();
  }
}
