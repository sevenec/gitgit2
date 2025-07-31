# Butterfly Nebula Brawl - iOS App Store Deployment Guide

## Prerequisites Required
- macOS computer (for Xcode and iOS builds)
- Xcode installed (free from Mac App Store)
- Apple Developer Account ($99/year - you mentioned it's set up)
- Node.js installed
- Cordova CLI installed

## Phase 1: Prepare React App for Mobile

### 1.1 Install Cordova
```bash
npm install -g cordova
```

### 1.2 Create Cordova Project Structure
```bash
# Create new Cordova project
cordova create ButterflyNebulaBrawl com.yourcompany.butterflynebulabrawl "Butterfly Nebula Brawl"
cd ButterflyNebulaBrawl

# Add iOS platform
cordova platform add ios

# Add required plugins
cordova plugin add cordova-plugin-splashscreen
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-screen-orientation
cordova plugin add cordova-plugin-vibration
cordova plugin add cordova-plugin-media
```

### 1.3 Copy Our Game Files
1. Build React app: `npm run build` (in our current project)
2. Copy everything from `/app/frontend/build/` to `/www/` in Cordova project
3. Update config.xml with proper settings

### 1.4 Configure for iOS App Store

**config.xml Configuration:**
```xml
<?xml version='1.0' encoding='utf-8'?>
<widget id="com.yourcompany.butterflynebulabrawl" version="1.0.0" xmlns="http://www.w3.org/ns/widgets" xmlns:cdv="http://cordova.apache.org/ns/1.0">
    <name>Butterfly Nebula Brawl</name>
    <description>Premium cosmic adventure through 15 unique levels</description>
    <author email="your-email@example.com" href="https://yourwebsite.com">Your Name</author>
    
    <content src="index.html" />
    
    <preference name="DisallowOverscroll" value="true" />
    <preference name="android-minSdkVersion" value="19" />
    <preference name="Orientation" value="portrait" />
    <preference name="Fullscreen" value="true" />
    <preference name="StatusBarOverlaysWebView" value="false" />
    <preference name="StatusBarBackgroundColor" value="#000000" />
    
    <platform name="ios">
        <preference name="WKWebViewOnly" value="true" />
        <feature name="CDVWKWebViewEngine">
            <param name="ios-package" value="CDVWKWebViewEngine" />
        </feature>
        <preference name="CordovaWebViewEngine" value="CDVWKWebViewEngine" />
        
        <!-- iOS Icons -->
        <icon src="res/ios/icon-57.png" width="57" height="57" />
        <icon src="res/ios/icon-114.png" width="114" height="114" />
        <icon src="res/ios/icon-72.png" width="72" height="72" />
        <icon src="res/ios/icon-144.png" width="144" height="144" />
        
        <!-- iOS Splash Screens -->
        <splash src="res/ios/Default~iphone.png" width="320" height="480" />
        <splash src="res/ios/Default@2x~iphone.png" width="640" height="960" />
    </platform>
</widget>
```

## Phase 2: Build iOS App

### 2.1 Build for iOS
```bash
# Build Cordova project
cordova build ios

# Open in Xcode
open platforms/ios/Butterfly\ Nebula\ Brawl.xcworkspace
```

### 2.2 Xcode Configuration
1. **Bundle Identifier**: Set to your registered App ID
2. **Team**: Select your Apple Developer Team
3. **Signing**: Enable "Automatically manage signing"
4. **Deployment Target**: iOS 12.0+ (recommended)
5. **Icons**: Add app icons in Assets.xcassets

### 2.3 Create IPA
1. **Product > Archive** (in Xcode)
2. **Distribute App**
3. **App Store Connect**
4. **Upload**

## Phase 3: App Store Connect Setup

### 3.1 Create New App
1. Go to https://appstoreconnect.apple.com
2. **My Apps > + > New App**
3. Fill in:
   - **Platforms**: iOS
   - **Name**: Butterfly Nebula Brawl
   - **Primary Language**: English
   - **Bundle ID**: com.yourcompany.butterflynebulabrawl
   - **SKU**: UNIQUE_SKU_001

### 3.2 App Information
- **Subtitle**: Premium Cosmic Adventure
- **Category**: Games > Action
- **Secondary Category**: Games > Arcade
- **Content Rights**: No
- **Age Rating**: Complete questionnaire (likely 4+)

### 3.3 Pricing and Availability
- **Price**: Free (with IAP) or $2.99 premium
- **Availability**: All territories

### 3.4 App Privacy
- **Data Collection**: None (if no analytics)
- **Contact Info**: Privacy policy URL (required)

## Phase 4: TestFlight Internal Testing

### 4.1 Add Internal Testers
1. **TestFlight tab**
2. **Internal Testing**
3. **Add Internal Testers**
4. Add your Apple ID email

### 4.2 Test on Your iPhone
1. Install **TestFlight app** from App Store
2. Accept invitation email
3. Install beta build
4. Test all features thoroughly

## Phase 5: App Store Review Submission

### 5.1 App Store Information
- **App Previews**: Record 3 gameplay videos
- **Screenshots**: 5 different screenshots showing variety
- **Description**: Compelling description highlighting unique features
- **Keywords**: butterfly, space, arcade, casual, premium
- **Support URL**: Your website
- **Privacy Policy URL**: Required

### 5.2 Submit for Review
1. **Complete all sections**
2. **Build**: Select uploaded IPA
3. **Submit for Review**
4. **Wait 24-48 hours** for Apple review

## Phase 6: Google Play Store (When Ready)

### 6.1 Build Android APK
```bash
# Add Android platform
cordova platform add android

# Build APK
cordova build android --release

# Sign APK (requires keystore)
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk alias_name
```

### 6.2 Google Play Console
1. Create new app
2. Upload APK
3. Set up store listing
4. Submit for review

## Automation Testing Script (To Run Before Submission)

```javascript
// Create this as a separate testing script
const testSessions = 100;
let passedTests = 0;
let failedTests = 0;

for (let i = 0; i < testSessions; i++) {
  try {
    // Simulate gameplay
    await simulateGameplay();
    passedTests++;
  } catch (error) {
    console.log(`Test ${i} failed:`, error);
    failedTests++;
  }
}

console.log(`Tests: ${passedTests}/${testSessions} passed`);
```

## Expected Timeline
- **Cordova Setup**: 2-4 hours
- **Xcode Build**: 1-2 hours  
- **App Store Connect**: 1-2 hours
- **Apple Review**: 24-48 hours
- **Total**: 3-5 days from start to App Store

## Next Steps for You
1. **Set up macOS development environment**
2. **Build React app** (I'll help prepare build files)
3. **Follow Cordova packaging steps**
4. **Test thoroughly with TestFlight**
5. **Submit to App Store**

Would you like me to:
1. **Prepare the optimized build files** for Cordova packaging?
2. **Create the automated testing scripts**?
3. **Help with any specific step** in this process?

Remember: The actual IPA generation happens on your macOS machine with Xcode, but I can prepare everything else perfectly for you!