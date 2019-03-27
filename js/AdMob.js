
  var admobid = {};

  if( /(android)/i.test(navigator.userAgent) ) {

    admobid = { // for Android

      banner: 'ca-app-pub-9748893793070764/5838896025',

      interstitial: 'ca-app-pub-9748893793070764/4114750812',

    };

  }

	

  function createSelectedBanner(){

    if(AdMob) AdMob.createBanner({

      adId: admobid.banner,

      overlap: $('#overlap').is(':checked'),

      offsetTopBar: $('#offsetTopBar').is(':checked'),

      adSize: $('#adSize').val(),

      position: $('#adPosition').val(),

    });

  }



function initApp() {

  if (! AdMob ) { alert( 'admob plugin not ready' ); return; }



  // this will create a banner on startup

  AdMob.createBanner( {

    adId: admobid.banner,

    position: AdMob.AD_POSITION.TOP_CENTER,

    overlap: false,

    offsetTopBar: true,

    bgColor: 'black'

  } );



  // this will load a full screen ad on startup

  AdMob.prepareInterstitial({

    adId: admobid.interstitial,

    autoShow: true

  });

}



if(( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) )) {

    document.addEventListener('deviceready', initApp, false);

} else {

    initApp();

}




