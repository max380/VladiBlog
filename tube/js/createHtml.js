/**
 * Created by admin on 28.04.2016.
 * List of functions for create html-card
 */
var $loader = $('.loader');
var $videos_collection = $(".videos-collection");
function createCard(item, id, span_watched, watched, type) {
    var fav = 'favorite_border';
    if (jStorageCheck(id, 'fav')) fav = 'favorite';

    var item_template = '' +
        '<div class="col s12 m8 offset-m2 list" data-id="' + id + '"><div class="card-panel z-depth-1 hoverable">' +
        '<div class="col s12 m12 l12 panel">' +
        '<div class="col s12 m6 l6 image">' +
        '<img src="' + item.snippet.thumbnails.high.url + '" class="responsive-img ' + watched + '">' + span_watched + '</div>' +
        '<div class="col s12 m6 l6 title">' +
        '<div class="col s12 m12 title-video">' + item.snippet.title + '</div>' +
        '<div class="col s12 m12 description-video"><p>' + item.snippet.description.slice(0, 200) + '...</p></div>' +
        '</div></div>' +
        '<div class="row valign-wrapper" style="display: block;margin-bottom: 0;">' +
        '<div class="col s12 m12 content-channel right">' +
        '</div>' +
        '</div></div></div>';

    $loader.hide();
    return item_template;
}

function createHtmlSimilar(data, nextPage, token) {


    var html = '', array_id = Array();

    $.each(data.items, function (i, item) {
        var id, watched = '', span_watched = '';

        if (item.id.videoId != undefined) {
            id = item.id.videoId;
        } else {
            id = item.snippet.resourceId.videoId;
        }
        var fav = 'favorite_border';
        if (jStorageCheck(id, 'fav')) fav = 'favorite';
        html += '<div class="col s12 list" data-id="' + id + '">' +
            '<div class="card-panel" style="overflow: hidden;padding-bottom: 0;">' +
            '<div class="col s12 m6 l6 panel" style="overflow: hidden;">' +
            '<div class="col s12 image" style="padding: 0;max-height: 190px;">' +
            '<img src="' + item.snippet.thumbnails.high.url + '" class="responsive-img ' + watched + '">' + span_watched + '</div>' +
            '</div><div class="col s12 m6 l6 title">' +
            '<div class="col s10 m10 l8 title-video truncate">' + item.snippet.title + '</div>' +
            '<div class="col s2 m2 l4 opt">' +
            '</div><div class="col s12 m12 l12 description-video" style="margin-top: 5px;">' +
            '<p>' + item.snippet.description.slice(0, 150) + '</p></div></div></div></div></div>';
        array_id.push(id);
    });

    if (nextPage) {
        if (token == '') {
            $('#block_similar').html(html);
        } else {
            $('#block_similar').html(html);
        }
        loading = true;
    } else {

        $('#block_similar').html(html);
        loading = false;
        $loader.hide();

    }

    $('.open-video a').css({backgroundColor: Settings.themeColors.colorPrimaryDark});
    $(window).scrollTop(0);
}


function createHtmlCard(data, nextPage, token, clear) {

    var html = '', wat_h = '', fav_h = '', array_id = Array();
    var favorites = $.jStorage.get('html');
    var $favoriteTab = $('#favorites');
    if (favorites !== null) {
        if (JSON.parse(favorites).length > 0 && JSON.parse(favorites)) {
            $.each(JSON.parse(favorites), function (i, item) {
                $(item[1]).find('#like').innerText = '';
                $(item[1]).find('#like').html();
                $(item[1]).find('#view').html();

                if ($favoriteTab.children('div').length < JSON.parse(favorites).length) {
                    $favoriteTab.append(item[1]);
                } else {
                    if (Settings.playList == 1) {
                        $('#favorites').append(item[1]);
                    } else {
                        if ($favoriteTab.find('div[data-id=' + item[0] + ']').length === 0) {
                            $('#favorites').append(item[1]);
                        }
                    }
                }
            });
        } else {
            $('#favorites').html('<h5 style="line-height: 40px;" class="center">У вас еще нет избранных видео</h5>');
        }
    } else {
        $('#favorites').html('<h5 style="line-height: 40px;" class="center">У вас еще нет избранных видео</h5>');
    }

    if ($('.videos-collection').find('div').length !== 0 && clear != false) {
        $('.videos-collection').remove('div');
    }

    $.each(data.items, function (i, item) {
        var id, watched = '', span_watched = '';

        if (item.id.videoId != undefined) {
            id = item.id.videoId;
        } else {
            id = item.snippet.resourceId.videoId;
        }


        if (jStorageCheck(id, 'all')) {
            watched = 'watched';
            span_watched = '<div class="watched-text"> Просмотрено </div>';
        }

        if (jStorageCheck(id, 'wat')) {
            if (Settings.playList == 1) {
                wat_h += createCard(item, id, span_watched, watched, null);
            } else {
                if ($('#watched-but').find('div[data-id=' + id + ']').length === 0) {
                    wat_h += createCard(item, id, span_watched, watched, null);
                }
            }
        }

        if ($('.videos-collection').find('div[data-id=' + id + ']').length === 0) {
            html += createCard(item, id, span_watched, watched, null);
        }
        array_id.push(id);
    });
    console.log($('#watched-but').length);
    console.log(wat_h);
    if (wat_h == ''){
        wat_h = '<h5 style="line-height: 40px;" class="center show">Videos you watch will appear in this list</h5>';
        if ($('#watched-but > div').find('h5').length !== 0){
            wat_h = '';
        }
    }

    if (nextPage) {
        if (token == '') {
            $videos_collection.html(html);
            $('#watched-but > div').html(wat_h);
        } else {
            $videos_collection.append(html);
                $('#watched-but > div').append(wat_h);
        }
        loading = true;
    } else {

        $videos_collection.append(html);
        $('#watched-but').append(wat_h);
        loading = false;
        $loader.hide();

    }
    $('.open-video a').css({backgroundColor: Settings.themeColors.colorPrimaryDark});
}
function showVideo(id) {
    window.location.href = "#" + id;
    $('.similar').removeClass('hide').addClass('show').find('html').append('<div class="col s12 center"><div class="loader_similar"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div>');
    //jStorageAdd(id);
    //location.href = 'https://www.youtube.com/watch?v='+id;

    $('.main').hide();

    $('.back').show();

    $('.brand-logo').hide();
	apiRequest("https://www.googleapis.com/youtube/v3/videos",{
		part:"snippet",
		id:id,
		key:apiKey
	},function (data) {

		var img = '';

		var video = data.items[0].snippet;

		var tag = '';

		if (video.tag) {
			tag = video.tags.join(',');
		} else {
			tag = video.title;
		}

		if (video.thumbnails.high) {
			img = video.thumbnails.high.url;
		} else {
			img = video.thumbnails.default.url;
		}

		var date = tData(video.publishedAt);

		var fav = '&#xE87E;';
		if (jStorageCheck(id, 'fav')) fav = 'favorite';


		$('.similar > div').html('' +
			'<div class="col s12" style="padding: 0px;display: block;"><div class="card" style="background-color: transparent;box-shadow: 0 0 0 0;">' + '<a href="https://www.youtube.com/watch?v=' + id + ' " target="_blank"><img width="100%" height="100%" src="yt-b.jpg"></a>' +
			'<div class="card-image waves-effect waves-block waves-light" style="padding: 0;margin: 0;">' +
			'<div class="btn-m" data-id="' + id + '"></div><iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + id + '" frameborder="0" allow="accelerometer; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
			'</div></div>' +
			'<div class="card"><div class="card-content" style="padding: 0 15px 0 15px;">' +
			'<span class="card-title activator grey-text text-darken-4">' + video.title + '</span>' +
			'<hr style="color: #FCFCFC;background-color: white;border-color: #FFFFFF;border-style: outset;">' +
			'<div class="col s12" style="margin: 15px 0 15px 0;padding-left: 0;padding-right: 0;">' +
			'<div class="col s6" style="padding-left: 0;">' +
			'<div class="col s6 left favorite-block" style="padding-left: 0;">' +
			'<div class="" style="">' +
			'<a class="waves-effect waves-light favorite-button" data-id="' + id + '" ' +
			'style="line-height: 10px;padding-left: 3px;width: 100%;text-transform: uppercase;color: black;">' +
			'<i class="material-icons" style="color: #039be5;">' + fav + '</i><span>избраное</span></a>' +
			'</div>' +
			'</div>' +
			'' +
			'<div class="col s6 right share-block" style="padding-left: 0;">' +
			'<div class="" style="">' +
			'<a class="waves-effect waves-light share-button" data-text="' + video.title + '" data-link="' + data.items[0].id + '" ' +
			'style="line-height: 10px;padding-left: 3px;width: 100%;text-transform: uppercase;color: black;">' +
			'<i class="material-icons" style="color: #039be5;">share</i><span>отправка</span></a>' +
			'</div>' +
			'</div>' +
			'' +
			'</div>' +
			'<div class="col s6" style="padding-left: 0;">' +
			'<div class="col s6 left" style="padding: 0;">' +
			'<a class="waves-effect waves-light" style="line-height: 10px;width: 100%;padding-left: 3px;text-transform: uppercase;color: black;">' +
			'<i class="material-icons ' + id + '-up" style="color: #000000;">&#xE8DC;</i></a>' +
			'</div>' +
			'<div class="col s6 left" style="padding: 0;">' +
			'<a class="waves-effect waves-light" style="line-height: 10px;width: 100%;padding-left: 3px;text-transform: uppercase;color: black;">' +
			'<i class="material-icons ' + id + '-down" style="color: #000000;">&#xE8DB;</i></a>' +
			'</div>' +
			'</div> ' +
			'</div> </div> </div> ' +
			'' +
			'<div class="card" style="">' +
			'<div class="card-content">' +
			'<span class="date_published">Опубликовано: ' + date + '</span> ' +
			'<p style="margin-top: 10px;" id="description-text"></p>' +
			'<div class="more-text" style="display:none;">Еще...</div>' +
			'</div> </div> ' +
			'' +
			'<div class="card similar-video" style="">' +
			'<h5 class="center-align" style="color: #6A6A6A;text-transform: uppercase;margin-top: 25px;">Полезные видео</h5>' +
			'<div class="card-content" id="block_similar">' +
			'<div class="col s12 center"><div class="loader_similar"><div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div></div> ' +
			'</div>' +
			'</div>'
		);

		// console.log(escapeHtml(video.description));
		$('#description-text').append(escapeHtml(video.description));
		if ($('#description-text').height() > 220) {
			$('.more-text').show();
		} else {
			$('.more-text').hide();
		}

		apiRequest("https://www.googleapis.com/youtube/v3/videos",{
			part:"statistics",
		id:id, key:apiKey
		},function (data) {

			console.log($('.' + id + '-down').parent().find('small').remove());
			console.log($('.' + id + '-up').parent().find('small').remove());

			var likeCount = data.items[0].statistics.likeCount;
			var dislikeCount = data.items[0].statistics.dislikeCount;
			if (dislikeCount.toString().length > 3) {
				$('.' + id + '-down').after('<small>' + numeral(dislikeCount).format('0.0a') + '</small>');
			} else {
				$('.' + id + '-down').after('<small>' + numeral(dislikeCount).format('0,0') + '</small>');
			}
			if (likeCount.toString().length > 3) {
				$('.' + id + '-up').after('<small>' + numeral(likeCount).format('0.0a') + '</small>');
			} else {
				$('.' + id + '-up').after('<small>' + numeral(likeCount).format('0,0') + '</small>');
			}

		});
		loadSimilarVideo(tag);
	});
}
function jStorageCheck(id, type) {
    if (type == 'all') {

        if (!$.jStorage.get('id-' + id)) return false;
        return true;

    } else if (type == 'wat') {

        if (!$.jStorage.get('id-' + id)) return false;
        return true;

    } else if (type == 'fav') {

        var array = JSON.parse($.jStorage.get('html'));
        var html = '';
        if (array !== null) {
            for (var a = 0; a < array.length; a++) {
                if (array[a][0] == id) {
                    return true;
                }
            }
        }

    }
}
function tData(date) {
    var s;
    var t = new Date(date);
    var y = t.getFullYear();
    var d = t.getDate();
    var mon = t.getMonth();
    switch (mon) {
        case 0:
            s = "Января";
            break;
        case 1:
            s = "Февраля";
            break;
        case 2:
            s = "Мара";
            break;
        case 3:
            s = "Ареля";
            break;
        case 4:
            s = "Мая";
            break;
        case 5:
            s = "Jun";
            break;
        case 6:
            s = "Jul";
            break;
        case 7:
            s = "Aug";
            break;
        case 8:
            s = "Sep";
            break;
        case 9:
            s = "Oct";
            break;
        case 10:
            s = "Nov";
            break;
        case 11:
            s = "Dec";
            break;
    }
    return d + " " + s + ". " + y + " г.";
}
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/\//g, "&#47;")
        .replace(/:/g, "&#58;")
        .replace(/\n/g, "<br/>")
        .replace(/@/g, "&#64;")
        .replace(/'/g, "&#039;");
}