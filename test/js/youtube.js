if (!Settings.colorsFromTheme) {
    Settings.themeColors.colorPrimary = "#" + Settings.colorPrimary;
    Settings.themeColors.colorAccent = "#" + Settings.colorAccent;
    Settings.themeColors.colorPrimaryDark = "#" + Settings.colorPrimaryDark;
}

jQuery(function ($) {
    var array = []
        , item_template = ''
        , $brand_logo = $('.brand-logo')
        , $title_playlist = $('#title-playlist')
        , $back = $('#back')
        , $notifications = $('#notifications')
        , $temp = $('#temp')
        , sort = false
        , similar = false
        , list = false;

    window.opt = true;

    $brand_logo.html(Settings.name);

    $title_playlist.css({color: Settings.themeColors.colorPrimary});

    $brand_logo.css({color: Settings.themeColors.colorPrimary});

    if (/playlist.*?\?.*?list=(.*)/i.test(Settings.channel)) {

        inputString = Settings.channel.replace(/&quot;/ig, ' ');
        loadVideos();

    } else if (/\/channel\/(.*?)(\?.*)?.*/.test(Settings.channel) || /\/user\/(.*?)(\?.*)?.*/.test(Settings.channel)) {

        var channel;
        if (/\/channel\/(.*?)(\?.*)?.*/.test(Settings.channel)) {
            channel = Settings.channel
                .replace(/(.*?)\?.*/, '$1')
                .replace(/.*\/channel\/(.*?)/, '$1')
                .replace(/(.*?)\/.*/, '$1');
            apiRequest('https://www.googleapis.com/youtube/v3/channels',
                {
                    part: 'contentDetails',
                    id: channel,
                    key: apiKey
                }, function (data) {
                    if(data.error == undefined){
                        $('#channelId').html(data.items[0].id);
                        $('.block-tabs').hide();
                        playlistVideo();

                    } else {
                        $('.videos-collection').html('<div style="text-align: center;margin-top: 100px;">'+data.error.message+'</div>');
                    }
                });
        } else if (/\/user\/(.*?)(\?.*)?.*/.test(Settings.channel)) {
            channel = Settings.channel
                .replace(/(.*?)\?.*/, '$1')
                .replace(/.*\/user\/(.*?)/, '$1')
                .replace(/(.*?)\/.*/, '$1');

            apiRequest('https://www.googleapis.com/youtube/v3/channels',
                {
                    part: 'contentDetails',
                    forUsername: channel,
                    key: apiKey
                }, function (data) {
                    if(data.error == undefined){

                        $('#channelId').html(data.items[0].id);
                        playlistVideo();

                    } else {
                        $('.videos-collection').html('<div style="text-align: center;margin-top: 100px;">'+data.error.message+'</div>');
                    }
                });
        }

    } else {

        apiRequest('https://www.googleapis.com/youtube/v3/channels', {
                part: 'contentDetails', forUsername: Settings.channel, key: apiKey
            },
            function (data) {
                $('#channelId').html(data.items[0].id);
            });
        if (Settings.playList == 1) {
            $('.sort').parent().hide();
            apiRequest('https://www.googleapis.com/youtube/v3/channels', {
                part: 'contentDetails',
                forUsername: encodeURIComponent(Settings.channel),
                key: apiKey
            }, function (data) {

                getPlayList(data.items[0].id);
            });
        } else {
            inputString = 'https://www.youtube.com/user/' + Settings.channel + '/feed'.replace(/&quot;/ig, ' ');
            loadVideos();
        }
    }

    $('.tabs .tab a').css({color: Settings.themeColors.colorPrimaryDark});

    $('.tabs .indicator').css({backgroundColor: Settings.themeColors.colorAccent});

    $('ul.tabs').tabs('select_tab', 'test1');

    $notifications.click(function () {
        if ('AppsgeyserJSInterface' in window) {
            AppsgeyserJSInterface.setItem('notifications', $(this).prop("checked"));
        }
    });

    has();

    $(window).hashchange(function () {
        has();
    });

    $back.click(function () {

        var back = $(this).data('playList');
        history.back();
        has();
        console.log(back);
        if(back == 'yes'){
            $('.tabs').css({opacity: 0});
            $('#all-video > div > div').remove();

            $('#watched-but > div > div').remove();
            $('#watched-but h5').remove();

            $('#favorites > div > div').remove();
            $('#favorites h5').remove();
        } else {
            $('.playlist').hide();
            similar = false;
            $('.similar > div div').remove();
            $('#token_similar').html('');
            $('.block-tabs').show();
            $('.similar').removeClass('show').addClass('hide');
            $('.main').show();
            if(Settings.playList == 2){
                $(this).parent().hide();
                $('.playlist, .brand-logo').show();
            }
        }
        loadVideos();
    });

    $('head').append('<style>.opt i  {color: ' + Settings.themeColors.colorPrimaryDark + '}' +
        '.opt i  {color: ' + Settings.themeColors.colorPrimaryDark + '}' +
        '.circles{background: ' + Settings.themeColors.colorPrimaryDark + ';box-shadow: 0 0 0 .1em ' + Settings.themeColors.colorPrimaryDark + ';}' +
        '</style>');

    $(document).on({
        click: function (event) {

            event.stopPropagation();

            var id = $(this).data('id'), value = $.jStorage.get('fav-' + id), array = $.jStorage.get('html');

            if ($(this).find('i').text() !== 'favorite') {

                if (array == null) {
                    array = [];
                } else {
                    array = JSON.parse(array);
                }

                apiRequest("https://www.googleapis.com/youtube/v3/videos",{
                    part:"snippet",
                    id:id,
                    key:apiKey
                },function (data) {
                    var item = data.items[0].snippet;
                    var img = '';
                    var h5_fav = $('#favorites h5');
                    if (item.thumbnails.high) {
                        img = item.thumbnails.high.url;
                    } else {
                        img = item.thumbnails.default.url;
                    }

                    html = '<div class="col s12 m8 offset-m2 list" data-id="' + id + '">' +
                        '<div class="card-panel">' +
                        '<div class="col s12 m12 l12 panel">' +
                        '<div class="col s12 m6 l6 image">' +
                        '<img src="' + img + '" class="responsive-img watched">' +
                        '<div class="watched-text"> Favorite </div></div>' +
                        '<div class="col s12 m6 l6 title">' +
                        '<div class="col s12 m12 title-video">' + item.title + '</div>' +
                        '<div class="col s12 m12 description-video"><p>' + item.description + '</p>' +
                        '</div></div></div>' +
                        '<div class="row valign-wrapper" style="display: block;margin-bottom: 0;">' +
                        '<div class="col s12 m12 content-channel right"></div></div></div></div>';
                    array.push([id, html]);
                    h5_fav.remove();
                    $.jStorage.set('fav-' + id, id);
                    $.jStorage.set('html', JSON.stringify(array));
                    $('a.waves-effect.waves-light.favorite-button[data-id="' + id + '"] .material-icons').html('favorite');
                    $('#favorites').append(html);

                });
            } else {
                $.jStorage.deleteKey('fav-' + id);
                $.jStorage.deleteKey('html-' + id);
                array = JSON.parse($.jStorage.get('html'));
                for (var i = 0; i < array.length; i++) {
                    if (array[i][0] == id) {
                        array.splice(array.indexOf(i), 1);
                    }
                }
                for (var a = 0; a < array.length; a++) {
                    if (array[a][0] == id) {
                        array.splice(array.indexOf(i), 1);
                    }
                }
                $.jStorage.set('html', JSON.stringify(array));

                $('#favorites').find('[data-id = ' + id + ']').remove();

                if ($('#favorites div').length == 0) {
                    $('#favorites').html('<h5 style="line-height: 40px;" class="center">Tap "favorite" button to add post to favorites</h5>');
                }
                $('a.waves-effect.waves-light.favorite-button[data-id="' + id + '"] .material-icons').html('favorite_border');
            }
        }
    }, ".favorite-button");

    $(document).on({
        click: function (event) {
            var text = $(this).data('text');
            var link = 'https://www.youtube.com/embed/' + $(this).data('link');
            appsgeyser.ui.shareText('Watch this video!', text + ' ' + link);
        }
    }, ".share-button");

    $(document).on({
        click: function () {
            var id = $(this).data('id');
            $('#back').data('playList','no').parent().show();
            showVideo(id);
			
        }
    }, ".list");

    $(document).on('click', '.btn-m', function () {
		
        if (!$(this).find('.btn-m').hasClass('disabled')) {
            $(this).find('.circles').addClass('no-circles');
            $(this).addClass('open-video ');

            var id = $('.btn-m').data('id');
            setTimeout(playVideo, 100, id);

            setTimeout('$(".btn-m").find(".circles").removeClass("no-circles");$(".btn-m").removeClass("disabled").removeClass("open-video")', 1000);
			
	   }
    });

    $(document).on('click', '.card-image.waves-effect.waves-block.waves-light', function () {
        if (!$(this).hasClass('disabled')) {
            $(this).find('.circles').addClass('no-circles');
            $(this).find('.btn-m').addClass('open-video ');

            var id = $('.btn-m').data('id');
            setTimeout(playVideo, 100, id);

            setTimeout('$(".btn-m").find(".circles").removeClass("no-circles");$(".btn-m").removeClass("disabled").removeClass("open-video")', 1000);
        }
    });

    $(document).on('click', '#open-playlist, .image-playlist', function () {
        var id = $(this).data("id");
        if (id == undefined) {
            id = $(this).find('a').data("id");
        }

        window.location.href = "#playList-" + id;
        inputString = 'https://www.youtube.com/playlist?list=' + id + ''.replace(/&quot;/ig, ' ');
        $('.tabs').css({opacity: 1});
        $('#open-list').css({display: 'block'});
        list = false;
        $('#back').parent().show();

        $title_playlist
            .html($(this).data('name'))
            .parent()
            .attr('class', 'col s8 m9 l8 dr');

        $('.col.s12.playlist, .brand-logo').hide();

        $('.block-tabs').show();
        $('#back').data('playList','yes');
        loadVideos();
    });

    $('#clear_hash').click(function () {
        history.pushState("", document.title, window.location.pathname);
        window.location.reload();
    });
    $(document).on('click', '.more-text', function () {
        $(this).parent().css({maxHeight: $('#description-text').height() + 200 + 'px'});
        $(this).text('Close');
        $(this).addClass('close-text');
    });

    $(document).on('click', '.close-text', function () {
        $(this).parent().css({maxHeight: 220 + 'px'});
        $(this).text('More text');
        $(this).removeClass('close-text');
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            console.log(loading);
            console.log(list);
            if (loading == true && list == false && $('#all-video-link').hasClass('active')) {
                loading = false;
                loadVideos();
            }
        }
    });

    if ('AppsgeyserJSInterface' in window) appsgeyserJsNotifications();

    function playVideo(id) {
        jStorageAdd(id);
        appsgeyser.media.playYouTubeVideo(id, null, 0, true, false);
    }

    function has() {
        var hash = window.location.hash;
        if(hash.indexOf('playList') == 1){
            if($('.playlist div').length == 0){
                var id = hash.replace(/#playList-/, '');
                inputString = 'https://www.youtube.com/playlist?list=' + id + ''.replace(/&quot;/ig, ' ');
                $('.tabs').css({opacity: 1});
                $('#open-list').css({display: 'block'});
                list = false;
                $title_playlist
                    .html($(this).data('name'))
                    .parent()
                    .attr('class', 'col s8 m9 l8 dr');

                $('.col.s12.playlist, .brand-logo').hide();

                $.jStorage.set('playList', 'yes');
                loadVideos();
            }else if($('#back').data('playList') == 'no'){
                $('#token_similar').html('');
                $('.block-tabs').show();
                $('.similar').removeClass('show').addClass('hide');
                $('.main').show();
                if(Settings.playList == 1){
                    $('.playlist, .brand-logo').hide();

                }
                loadVideos();
            } else if($('#back').data('playList') == 'yes'){
            }
        }else{
            $('#temp').html('');
            if (hash !== '') {
                if($('.similar > div div').length == 0){
                    var tag = hash.replace(/#/, '');
                    showVideo(tag);
                    $('#back').data('playList','no');
                    $('.tabs').css({opacity: 1});
                    $('#open-list').css({display: 'block'});
                    list = false;
                    $title_playlist
                        .html($(this).data('name'))
                        .parent()
                        .attr('class', 'col s8 m9 l8 dr');

                    $('.col.s12.playlist, .brand-logo').hide();
                } else {
                    if(Settings.playList == 1){
                        $('.tabs').css({opacity: 0});
                        $('#all-video > div div').remove();

                        $('#watched-but > div div').remove();
                        $('#watched-but h5').remove();

                        $('#favorites > div div').remove();
                        $('#favorites h5').remove();
                    }
                }
            }else{
                similar = false;

                if($('#back').data('playList') == undefined && $('.similar > div div').length == 0 ) {
                    $('#back').parent().hide();
                    $('#token_similar').html('');
                    $('.block-tabs').show();
                    $('#back-pl').parent().show();
                    $('.similar').removeClass('show').addClass('hide');
                    $('.main').show();
                    $('.playlist, .brand-logo').show();
                    $(this).hide();
                } else {
                    if($('#back').data('playList') == 'yes'){
                        $('#back').parent().hide();
                        $('#token_similar').html('');
                        $('.block-tabs').show();
                        $('#back-pl').parent().show();
                        $('.similar').removeClass('show').addClass('hide');
                        $('.main').show();
                        $('.playlist, .brand-logo').show();
                        $(this).hide();
                        if(Settings.playList == 1){
                            $('.tabs').css({opacity: 0});

                            $('#all-video > div div').remove();

                            $('#watched-but > div div').remove();
                            $('#watched-but h5').remove();

                            $('#favorites > div div').remove();
                            $('#favorites h5').remove();
                        }
                    } else {
                        $('#token_similar').html('');
                        $('.block-tabs').show();
                        $('.similar').removeClass('show').addClass('hide');
                        $('.main').show();
                        if(Settings.playList == 1){
                            $('.playlist, .brand-logo').hide();

                        } else{
                            $('.playlist, .brand-logo').show();
                            $('#back').parent().hide();
                        }
                        loadVideos();
                    }
                }
            }
        }
    }

    function playlistVideo() {
        if (Settings.playList == 1) {
            var hash = window.location.hash;
            getPlayList($('#channelId').html());
        } else {
            //$('#back').parent().hide();
            $('.tabs').css({opacity: 1});
            inputString = Settings.channel.replace(/&quot;/ig, ' ');
            loadVideos();
        }
    }

    function jStorageAdd(id) {
        var value = $.jStorage.get('id-' + id);
        if (!value) {
            $.jStorage.set('id-' + id, id);
        }
    }

    function loadVideos() {

        if (/\/channel\/(.*?)(\?.*)?.*/.test(inputString) || /\/user\/(.*?)(\?.*)?.*/.test(inputString)) {
            $('#back').data('playList','no');
            loadVideoFromChannel();
        } else  {
            $('#back').data('playList','yes');
            loadFromPlaylist();
        }

        if ('AppsgeyserJSInterface' in window) appsgeyserJsNotifications();

    }

    function appsgeyserJsNotifications() {
        var id = $('#channelId').text()
            , ONE_HOUR = 1000 * 60 * 60
            , notifications = AppsgeyserJSInterface.getItem('notifications');

        AppsgeyserJSInterface.setItem('idChannel', id);

        if (notifications !== 'false') {
            AppsgeyserJSInterface.setItem('notifications', true);
            AppsgeyserJSInterface.registerUpdateChecker('checker.html', ONE_HOUR);
            $notifications.prop('checked', true);
        } else {
            AppsgeyserJSInterface.setItem('notifications', false);
            AppsgeyserJSInterface.removeUpdateChecker('checker.html');
            $notifications.prop('checked', false);
        }
    }

});