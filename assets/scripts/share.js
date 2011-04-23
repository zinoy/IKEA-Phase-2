function shareToWeibo(title, pic, url){
    if (!url) {
        url = encodeURIComponent(location.href);
    }
    if (!pic) {
        pic = '';
    }
    _gaq.push(['_trackEvent', 'Share', 'Weibo', title]);
    window.open("http://service.t.sina.com.cn/share/share.php?url=" + url + "&appkey=&title=" + encodeURIComponent(title) + "&pic=" + encodeURIComponent(pic) + "&ralateUid=1785749160", "_blank", "width=615,height=505");
    return false;
}

//1084507655
function shareToKaixin(t, c, u){
    if (!u) {
        u = encodeURIComponent(location.href);
    }
    _gaq.push(['_trackEvent', 'Share', 'Kaixin', t]);
    window.open("http://www.kaixin001.com/repaste/bshare.php?rtitle=" + encodeURIComponent(t) + "&rcontent=" + encodeURIComponent(c) + "&rurl=" + u, "_blank");
    return false;
}

function shareToRenren(t, u){
    if (!u) {
        u = location.href;
    }
    _gaq.push(['_trackEvent', 'Share', 'Renren', t]);
    ren(screen, document, encodeURIComponent, u, t)
    return false;
}

$(document).ready(function(){
    if ($('#sliderbar').hasClass('event')) {
        return;
    }
    $('#sliderbar li a').each(function(i){
        switch (i) {
            case 1:
                $(this).click(function(){
                    shareToWeibo('宜家社区全新上线！来宜家社区逛逛吧，搜罗更多爱家资讯。', 'http://61.152.239.60/assets/images/sns_living.jpg');
                    return false;
                });
                break;
            case 2:
                $(this).click(function(){
                    shareToKaixin('宜家社区', '宜家社区全新上线！来宜家社区逛逛吧，搜罗更多爱家资讯。');
                    return false;
                });
                break;
            case 3:
                $(this).click(function(){
                    shareToRenren('宜家社区全新上线！来宜家社区逛逛吧，搜罗更多爱家资讯。');
                    return false;
                });
                break;
            default:
                break;
        }
    });
    $('.state dl dd a').each(function(i){
        var txt = getContent();
        var pic = getImage();
        switch (i) {
            case 0:
                $(this).click(function(){
                    shareToWeibo(txt, pic);
                    return false;
                });
                break;
            case 1:
                $(this).click(function(){
                    shareToKaixin('宜家社区', txt);
                    return false;
                });
                break;
            case 2:
                $(this).click(function(){
                    shareToRenren(txt);
                    return false;
                });
                break;
            default:
                break;
        }
    });
});

function getContent(){
    var subject = $('.topic_detail .detail h4').text();
    if ($(document.body).hasClass('topic')) {
        return '我在宜家社区看到一篇不错的家居文章“' + subject + '”，分享给大家。去宜家社区看看吧！';
    } else if ($(document.body).hasClass('event')) {
        return '快来和我一起关注宜家社区最新爱家行动“' + subject + '”。';
    } else if ($(document.body).hasClass('media')) {
        return '抢先收看宜家社区互动视频“' + subject + '”。';
    }
}

function getImage(){
    var pic = $('.info .pic img').attr('src');
    if (pic) {
        var host = SERVER_HTTP_HOST();
        if (pic.substr(0, 1) != '/') {
            pic = '/' + pic;
        }
        if ($(document.body).hasClass('media')) {
            return '';
        } else {
            return host + pic;
        }
    } else {
        return '';
    }
}

function SERVER_HTTP_HOST(){
    var url = window.location.href;
    url = url.replace("http://", "");
    
    var urlExplode = url.split("/");
    var serverName = urlExplode[0];
    
    serverName = 'http://' + serverName;
    return serverName;
}

function ren(s, d, e, u, l){
    if (!l) 
        l = d.title;
    var f = 'http://share.renren.com/share/buttonshare?link=', p = [e(u), '&title=', e(l)].join('');
    function a(){
        if (!window.open([f, p].join(''), 'xnshare', ['toolbar=0,status=0,resizable=1,width=626,height=436,left=', (s.width - 626) / 2, ',top=', (s.height - 436) / 2].join(''))) 
            u.href = [f, p].join('');
    };
    if (/Firefox/.test(navigator.userAgent)) 
        setTimeout(a, 0);
    else 
        a();
}

