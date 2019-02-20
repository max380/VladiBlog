/**
 * Created by admin on 28.04.2016.
 * List of functions for youtube API
 */
$.support.cors = true;
var $channelId = $('#channelId');
var $temp = $('#temp');
var apiKeys = ['AIzaSyC7Sxnjmy-557cICuoyFtLf1rXl5wWH4Uc', 'AIzaSyC7Sxnjmy-557cICuoyFtLf1rXl5wWH4Uc', 'AIzaSyAvjsAmcLANJSnm3sNfOJya-YH4_a1V0CQ', 'AIzaSyA5vtGnh94IspnpqlB6Rn7_vOX3eu3BJRA', 'AIzaSyCPwD_Y7FiQno4dbw_f-nNaHHVqGYLjhpU']
    , apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)]
    , html = ''
    , $playlist = $(".playlist")
    , inputString = ''
    , $date = $('#date');

function apiRequest(url,data,callback){
	$.ajax({
		url:url,
		dataType:"jsonp",
		jsonp: "callback",
		data: data,
		success: callback
});
}

function loadFromPlaylist() {

    $('.tabs').css({opacity: 1});

	apiRequest('https://www.googleapis.com/youtube/v3/playlistItems', {
            part: 'snippet',
            playlistId: inputString.replace(/(.*?)\list=/, ''),
            maxResults: 50,
            pageToken: $('#temp').html(),
            key: apiKey
        }, function (data) {
            console.log(data.items);
            $date.addClass('active');
            $channelId.html(data.items[0].snippet.channelId);

            if ('AppsgeyserJSInterface' in window) {
                AppsgeyserJSInterface.setItem('lastPostTime', data.items[0].snippet.publishedAt);
            }
            console.log(!data.nextPageToken);

            loading = false;
            if (!data.nextPageToken) {

                if ($('.playlist').css('display') == 'none' || Settings.playList == 2) {
                    createHtmlCard(data, false, null, false);
                }

            } else {
                $('#temp').html(data.nextPageToken);
                createHtmlCard(data, true, data.nextPageToken, false);
            }
        }
    );
}



function loadVideoFromChannel() {

    $('.tabs').css({opacity: 1});
	apiRequest('https://www.googleapis.com/youtube/v3/search', {
            part: 'snippet',
            maxResults: 10,
            channelId: $channelId.text(),
            pageToken: $('#temp').html(),
            type: 'video',
            order: 'date',
            key: apiKey
        }, function (data) {

            $date.addClass('active');
            if(data.error == undefined){

                $channelId.html(data.items[0].snippet.channelId);

                if ('AppsgeyserJSInterface' in window) {
                    AppsgeyserJSInterface.setItem('lastPostTime', data.items[0].snippet.publishedAt);
                }
                list = false;

                if (!data.nextPageToken) {
                    createHtmlCard(data, false, null, false);
                } else {
                    $('#temp').html(data.nextPageToken);
                    createHtmlCard(data, true, data.nextPageToken, false);
                }

            } else {
                $('.videos-collection').html('<div style="text-align: center;margin-top: 100px;">'+data.error.message+'</div>');
            }
        }
    );
}

function getPlayList(id) {
	apiRequest(
        'https://www.googleapis.com/youtube/v3/playlists', {
            part: 'snippet',
            channelId: id,
            key: apiKey,
            maxResults: 50
        }, function (data) {
            if (data.items == '') {
                $('.tabs').css({opacity: 1});
                inputString = id;
                loadVideoFromChannel();
            }

            console.log(data)
            $.each(data.items, function (i, item) {
                if(item.snippet.thumbnails.high.url !== 'http://s.ytimg.com/yts/img/no_thumbnail-vfl4t3-4R.jpg'){
                    item_template = '' +
                        '<div class="col s12 m8 offset-m2 l6 offset-l3" id="' + item.id + '">' +
                        '<div class="card-panel grey lighten-5 z-depth-1 playlist-card-panel">' +
                        '<div style="background-image: url(' + item.snippet.thumbnails.high.url + ')" class="image-playlist">' +
                        '<div class="info-playlist"><a class="waves-effect waves-light btn truncate" id="open-playlist" data-id="' + item.id + '" data-name="' + item.snippet.title + '">' + item.snippet.title + '</a></div>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                    html += item_template;
                }
            });

            $loader.hide();
            $playlist.html(html);
            $('.info-playlist a').css({backgroundColor: Settings.themeColors.colorPrimary});
        }
    );
}

function loadFromVideoSort(order) {
    sort = true;
    if (order == undefined) order = $('#order').text();


	apiRequest('https://www.googleapis.com/youtube/v3/search', {
            part: 'snippet',
            maxResults: 10,
            order: order,
            channelId: $channelId.text(),
            pageToken: $('#temp').html(),
            type: 'video',
            key: apiKey
        }, function (data) {
            loading = false;

            if (!data.nextPageToken) {
                createHtmlCard(data, false);
            } else {
                $('#temp').html(data.nextPageToken);
                createHtmlCard(data, true, data.nextPageToken);
            }
        }
    );
}

function loadSimilarVideo(val) {
    similar = true;

    $('body').append('<div style="display:none" id="val_similar">' + val + '</div>');

	apiRequest('https://www.googleapis.com/youtube/v3/search', {
            part: 'snippet',
            channelId: $channelId.text(),
            pageToken: $('#temp').html(),
            type: 'video',
            key: apiKey,
            maxResults: 50
        }, function (data) {
            loading = false;

            data.items.sort(function() {
                return .5 - Math.random();
            });

            if (data.items.length === 0) $('.card.similar-video').hide();

            if (!data.nextPageToken) {
                createHtmlSimilar(data, false);
            } else {
                $('#token_similar').html(data.nextPageToken);
                createHtmlSimilar(data, true, data.nextPageToken);
            }
        }
    );
}