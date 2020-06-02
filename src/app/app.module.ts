import { NgModule, ErrorHandler  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { XmlJson } from '$user-root/src/services/shared-service/xml-json.service';
import { EmployeeSetupPageModule } from './employee/employee-setup.module';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found.component';
import { SideMenuNavigationModule } from './side-menu-navigation/side-menu-navigation.module';
import { LoginModule } from './login/login.module';
import bugsnag from '@bugsnag/js'
import { BugsnagErrorHandler } from '@bugsnag/plugin-angular'

const bugsnagClient = bugsnag('a856baea01e03638403f09253bc830a2')

export function errorHandlerFactory() {
  return new BugsnagErrorHandler(bugsnagClient)
}

bugsnagClient.notify(new Error('Test error'))

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot({ mode: 'md' }),
    AppRoutingModule,
    LoginModule,
    SideMenuNavigationModule,
    EmployeeSetupPageModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    XmlJson,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: ErrorHandler, useFactory: errorHandlerFactory }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
