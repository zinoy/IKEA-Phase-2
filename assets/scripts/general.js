$.fn.serializeObject = function(){
    var o = {};
    var a = this.serializeArray();
    $.each(a, function(){
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
path_root = '/git/IKEA-Phase-2/';
$(document).ready(function(){
    if ($('.scroll-pane').length > 0) {
        $('.scroll-pane').jScrollPane({
            hideFocus: true,
            verticalDragMinHeight: 46,
            verticalDragMaxHeight: 46
        });
        $(document).pngFix();
    }
    //$('.room_type li a').mouseover(swapImg);
    //$('.room_type li a').mouseout(swapImg);
    $('#userSignin').submit(function(){
        var values = $('#userSignin').serializeObject();
        $.post(path_root + 'ajaxLogin.action', $('#userSignin').serialize(), function(data){
            if (data.ajaxMSG) {
                doSignin(values.uname, $('#userSignin select').val());
                showErr([data.ajaxMSG]);
            } else {
                if ($('#ipt_remember').get(0).checked) {
                    $.cookie('ikea_authstr', [values.loginType, values.uname, values.upwd].join(','), {
                        expires: 365
                    });
                } else {
                    $.cookie('ikea_authstr', null);
                }
                window.location.reload();
            }
        }, 'json');
        return false;
    });
    var saved = $.cookie('ikea_authstr');
    if (saved) {
        var p = saved.split(',');
        $('#userSignin select').val(p[0]);
        $('#userSignin input[name="uname"]').val(p[1]);
        $('#userSignin input[name="upwd"]').val(p[2]);
        $('#ipt_remember').attr('checked', 'checked');
    }
    $('#userSignin select').change(function(){
        $(this).next('input').val('').focus();
    });
    $('#ubSignup').click(doReg);
    $('#ubSignin').click(doSignin);
    $('#ubSignout').click(function(){
        $.getJSON(path_root + 'ajaxlogout.action', {
            seed: Math.random()
        }, function(){
            window.location.reload();
        });
    });
    $('#fPass').click(doFindPass);
    $('#mediaCtn span').css('opacity', 0);
    $('#mediaCtn a').mouseover(function(){
        $(this).next('span').stop().show().animate({
            opacity: 1,
            right: 31
        });
    });
    $('#mediaCtn a').mouseout(function(){
        $(this).next('span').stop().animate({
            opacity: 0,
            right: 0
        }, function(){
            $(this).hide();
        });
    });
    $('#mediaCtn .like').mousedown(function(){
        $(this).css('background-position', 'left -410px');
    });
    $('#mediaCtn .like').mouseup(function(){
        $(this).css('background-position', 'left -390px');
    });
    $('#mediaCtn .like').click(function(){
        var id = $('.whats_new .combo_box h4 a').attr('rel');
        var scount = $.cookie("scount_vddid_" + id);
        if (!scount) {
            var now = new Date();
            $.cookie("scount_vddid_" + id, 1, {
                expires: 1
            });
        } else if (scount < 3) {
            scount = parseInt(scount) + 1;
            $.cookie("scount_vddid_" + id, scount);
        } else {
            showPopup('error', '一天只能赞3次。');
            return;
        }
        $.getJSON(path_root + 'supportVdDetail.action', {
            vddid: id,
            seed: Math.random()
        }, function(data){
            $('.whats_new .combo_box .iconList .icon_like').text(data.count + ' 人喜欢');
            $('#mediaCtn span').text(data.count + ' 人喜欢');
        });
        return false;
    });
    if ($('#pageNav a.on').length > 0) {
        $('#pageNav a.on').parent('li').append('<i></i>');
        $('#pageNav i').width($('#pageNav a.on').parent('li').width());
    }
    $('#navSearch input').focus(function(){
        if ($(this).val() == '请输入关键词') {
            $(this).val('');
        }
    });
    $('#navSearch input').blur(function(){
        if ($.trim($(this).val()) == '') {
            $(this).val('请输入关键词');
        }
    });
    $('.state p a').each(function(i){
        switch (i) {
            case 0:
                $(this).click(doReg);
                break;
            case 1:
                $(this).click(doSignin);
                break;
            default:
                break;
        }
    });
    $('.rate_room li').each(function(i, n){
        $(n).children('a:first').click(function(){
            showPopup('pic', '<img src="../assets/images/temp/zoom_sample.jpg" alt="sample" height="526" width="716" />');
            return false;
        });
    });
    initSliderBar();
    bindButtons();
    hfCenter();
    initTab();
    subSlider();
    uploadAvatar();
    initPopup();
    initPoll();
    addCard();
});

function initSliderBar(){
    $(window).scroll(function(){
        $('#sliderbar').stop();
        $("#sliderbar").animate({
            top: $(document).scrollTop()
        }, "slow");
    });
}

function swapImg(evt){
    var obj = $(this).children('img');
    var img = obj.attr('src');
    var parts = img.split('.');
    var name = parts[0].split('_');
    var src = '';
    if (name[name.length - 1] == 'on') {
        for (i = 0; i < name.length - 1; i++) {
            if (i > 0) {
                src += '_';
            }
            src += name[i];
        }
        src += '.' + parts[1];
    } else {
        src = parts[0] + '_on.' + parts[1];
    }
    obj.attr('src', src);
}

function homeAccordion(){
    var act = function(){
        if ($(this).hasClass('on')) {
            var na;
            $('.hfcenter > a').each(function(i, n){
                if (!$(n).hasClass('on')) {
                    na = n;
					return false;
                }
            });
			$('.hfcenter .acc').slideUp('normal');
			$('.hfcenter a').removeClass('on');
			$(na).addClass('on').next('.acc').slideDown('normal');
            return false;
        }
        $('.hfcenter .acc').slideUp('normal');
        $('.hfcenter a').removeClass('on');
        $(this).addClass('on').next('.acc').slideDown('normal');
        return false;
    }
    $('.hfcenter #rooms').click(act);
    $('.hfcenter #hot').click(act);
}

function hfCenter(){
    if ($('.slideshow').length > 0) {
        var interval = 5000;
        var iCount = $('.slideshow .numbers dd').length;
        if (iCount == 0) {
            iCount = 1;
        }
        var urls = $('.slideshow li span.hidden_elem');
        var w = $('.slideshow li').width();
        var ulWidth = iCount * w;
        var sIndex = 0;
        $('.slideshow ul').css("width", ulWidth + 'px');
        $('.slideshow dd a').mouseover(function(){
            $(".slideshow ul").stop();
            $('.slideshow dd.on').removeClass('on');
            $(this).parent('dd').addClass('on');
            var idx = $(this).text() - 1;
            var ulMargin = idx * w * -1;
            $(".slideshow ul").animate({
                'margin-left': ulMargin + 'px'
            }, "slow");
            sIndex = idx;
            $('.slideshow').next('.bLine .more:first').attr('href', $(urls[sIndex]).text());
        });
        var hfTimer = setInterval(autoSlide, interval);
        $('.slideshow').next('.bLine .more:first').attr('href', $(urls[0]).text());
        $('.slideshow').mouseover(function(){
            clearInterval(hfTimer);
        });
        $('.slideshow').mouseout(function(){
            hfTimer = setInterval(autoSlide, interval);
        });
    }
    function autoSlide(){
        $(".slideshow ul").stop();
        sIndex++;
        if (sIndex == iCount) {
            sIndex = 0;
        }
        $('.slideshow dd.on').removeClass('on');
        $($('.slideshow dd')[sIndex]).addClass('on');
        var w = $('.slideshow li').width();
        var ulMargin = sIndex * w * -1;
        $(".slideshow ul").animate({
            'margin-left': ulMargin + 'px'
        }, "slow");
        $('.slideshow').next('.bLine .more:first').attr('href', $(urls[sIndex]).text());
    }
    $('.accordion dd a').mouseover(function(){
        if (!$(this).hasClass('on')) {
            var parts = $(this).children('img').attr('src').split('.');
            var img = '';
            for (x = 0; x < parts.length - 2; x++) {
                img += parts[x] + '.';
            }
            img += parts[parts.length - 2] + '_hover';
            $(this).children('img').attr('src', img + '.' + parts[parts.length - 1]);
        }
    });
    $('.accordion dd a').mouseout(function(){
        if (!$(this).hasClass('on')) {
            var parts = $(this).children('img').attr('src').split('.');
            var img = '';
            for (x = 0; x < parts.length - 2; x++) {
                img += parts[x] + '.';
            }
            img += parts[parts.length - 2].split('_')[0];
            $(this).children('img').attr('src', img + '.' + parts[parts.length - 1]);
        }
    });
}

function initPoll(){
    $('#userCol .poll button.ok').click(function(){
        var data = $('#userCol .poll form').serialize();
        if ($('input[name="poll"]:checked').length == 0) {
            showPopup('error', '<p>请选择一个选项。</p>');
            return false;
        }
        $.getJSON(path_root + 'survey.action', data, function(json){
            if (json.ajaxMSG == 'ok') {
                showPopup('notice', '<p>感谢您的参与！</p>');
            } else {
                showPopup('error', '<p>' + json.ajaxMSG + '</p>');
            }
        });
    });
    $('#userCol .poll button.result').click(function(){
        $.getJSON(path_root + 'gtresult.action', {
            'sid': $('input[name="sid"]').val(),
            'seed': Math.random()
        }, function(json){
            if (json) {
                $(json.p).each(function(i){
                    var p = this;
                    var w = 156 * p;
                    $($('#poll_result td span')[i]).css('width', w + 'px');
                    $($('#poll_result td.percent')[i]).text(Math.floor(p * 100) + '%');
                });
                $('.mask').show();
                $('#poll_result').show();
                $('.popup .close').click(function(){
                    hidePopup();
                });
                centerPopup();
                $('#poll_result .gbtn').click(function(){
                    $('.popup').hide();
                    $('.mask').hide();
                });
            }
        });
    });
}

function subSlider(){
    if ($.browser.version == '7.0') {
        $('.topic_detail .sub div').css('margin', '0');
    }
    $('.sub li span').css({
        opacity: .5
    }).mouseover(function(){
        $(this).css('display', 'none');
    });
    $('.sub li').mouseover(function(){
        $(this).children('span').css('display', 'none');
        $(this).children('i').css('display', 'none');
    });
    $('.sub li').mouseout(function(){
        if (!$(this).hasClass('on')) {
            $(this).children('span').fadeIn(84);
            $(this).children('i').fadeIn(84);
        }
    });
    var ulMargin = 0;
    var items = $(".sub ul li");
    var liMargin;
    if ($('.topic').length > 0) {
        liMargin = 2;
    } else if ($('.member').length > 0) {
        liMargin = 5;
    } else {
        liMargin = 7;
    }
    var iWidth = $('.sub li img').width() + liMargin;
    var ulWidth = items.length * iWidth;
    $(".sub ul").width(ulWidth);
    //ulWidth *= -1;
    var stageWidth = $('.sub div').width();
    if (ulWidth > stageWidth) {
        items.each(function(i){
            if (i > 0) {
                i--;
            }
            if ($(this).hasClass('on')) {
                ulMargin = i * iWidth * -1;
                while (ulMargin < (ulWidth - stageWidth - liMargin) * -1) {
                    ulMargin += iWidth;
                }
                $(".sub ul").css({
                    'margin-left': ulMargin + 'px'
                }, "normal");
            }
        });
    } else {
        $('.sub .prev').hide();
        $('.sub .next').hide();
    }
    
    $('.sub .next').click(function(){
        if (ulMargin > (ulWidth - stageWidth - liMargin) * -1) {
            ulMargin -= iWidth;
            $(".sub ul").animate({
                'margin-left': ulMargin + 'px'
            }, "slow");
        }
    });
    $('.sub .prev').click(function(){
        if (ulMargin < 0) {
            ulMargin += iWidth;
            $(".sub ul").animate({
                'margin-left': ulMargin + 'px'
            }, "slow");
        }
    });
    //$('.sub li a').click(function(){
    //    $('.sub li.on').removeClass('on').children('span').css('display', 'block');
    //    $(this).parent('li').addClass('on');
    //});
    $('.items dd a').mouseover(function(){
        $(this).parent('dd').addClass('on');
        var w = $(this).next('div').width();
        var l = (73 - w) / 2;
        $(this).next('div').css('left', l + 'px');
    });
    $('.items dd a').mouseout(function(){
        $('.items dd.on').removeClass('on');
    });
    /*$('.pic').mouseover(function(){
     $('.pic a.on').stop();
     $('.pic a.on').fadeTo('normal', 1);
     });
     $('.pic a').mouseover(function(){
     $('.pic a.on').stop();
     $('.pic a.on').fadeTo('normal', 1);
     });
     $('.pic').mouseout(function(){
     $('.pic a.on').stop();
     $('.pic a.on').fadeTo('normal', 0);
     //setTimeout(function(){
     //
     //}, 3000);
     });*/
    var current = $('.sub li.on');
    var nitem = current.next('li');
    var pitem = current.prev('li');
    if (nitem.length > 0) {
        $('.pic a.next').attr('href', nitem.children('a').attr('href'));
        $('.pic a.next').show();
    }
    if (pitem.length > 0) {
        $('.pic a.prev').attr('href', pitem.children('a').attr('href'));
        $('.pic a.prev').show();
    }
}

function initPopup(){
    if ($('.mask').length == 0) {
        $(document.body).append('<div class="mask"></div>');
    }
    resizeMask();
    $(window).resize(resizeMask);
    if ($('#popup').length == 0) {
        $(document.body).append('<div class="popup" id="popup"><a class="close"></a><div class="" id="frame"></div></div>');
    }
    hidePopup();
}

function showPopup(t, html, callback){
    ///t=['notice','success','error','send','other'];
    $('.mask').show();
    if (t != 'other') {
        $('#popup').html('<a class="close"></a><div class="" id="frame"></div>');
        $('#popup #frame').attr('class', t).html(html);
        $('#popup').show();
        if ($('#frame').height() < 26 && t != 'pic') {
            $('#frame').height(26);
        }
    } else {
        $('#popup').show();
    }
    if (t == 'notice') {
        setTimeout(function(){
            hidePopup();
            if (callback) {
                callback();
            }
        }, 5000);
    }
    if (t == 'pic') {
        $('#frame img').load(function(){
            centerPopup();
        });
    }
    $('.popup .close').click(function(){
        hidePopup();
        if (callback) {
            callback();
        }
    });
    centerPopup();
}

function hidePopup(){
    $('.popup').hide();
    $('.mask').hide();
}

function resizeMask(){
    var mask = $('.mask');
    var w = $(window).width();
    var h = $(document).height();
    mask.css({
        height: h,
        width: w,
        opacity: .4
    });
}

function centerPopup(){
    var w = $(window).width();
    var h = $(window).height();
    var t = $(document).scrollTop();
    $('.popup').each(function(){
        var iw = $(this).width();
        var ih = $(this).height();
        var left = (w - iw) / 2;
        var top = (h - ih) / 2 + t;
        if (top < 60) {
            top = 60;
        }
        $(this).css({
            left: left,
            top: top
        });
    });
    resizeMask();
}

function initDefault(){
    var avatars = $('#step1 .options li a');
    avatars.click(function(){
        $('#step1 form img').attr('src', $(this).children('img').attr('src'));
        var idx = $.inArray(this, avatars) + 1;
        $('input[name="avatarid"]').val(idx);
        $('#step1 form p').show();
    });
}

var swfu;
function uploadAvatar(){
    if ($('.avatar').length == 0) {
        return;
    }
    initDefault();
    swfu = new SWFUpload({
        upload_url: path_root + "uploadUimg.action",
        flash_url: path_root + "assets/flash/swfupload.swf",
        file_size_limit: "2 MB",
        button_placeholder_id: "upload_placeholder",
        button_image_url: path_root + "assets/images/members/btn_upload.gif",
        button_width: 85,
        button_height: 18,
        button_action: SWFUpload.BUTTON_ACTION.SELECT_FILE,
        button_cursor: SWFUpload.CURSOR.HAND,
        file_types: "*.jpg;*.gif;*.png",
        file_types_description: "支持的图片文件",
        button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
        file_queue_limit: 1,
        
        file_dialog_complete_handler: dialogClose,
        
        upload_progress_handler: uploadProgress,
        upload_error_handler: uploadError,
        upload_success_handler: uploadSuccess
    });
}

function dialogClose(selected, queued, total){
    swfu.startUpload();
}

function uploadSuccess(file, data, response){
    var json = $.parseJSON(data);
    $('#step1').hide();
    $('#step2').show();
    var h = json.picH;
    var w = json.picW;
    var initH, initW;
    if (h < w) {
        if (h < 180) {
            initH = h;
        } else {
            initH = 180;
        }
    } else {
        if (w < 178) {
            initW = w;
        } else {
            initW = 180;
        }
    }
    
    $('#cropbox').attr('src', json.compressUrl).Jcrop({
        minSize: [initW, initW],
        setSelect: [0, 0, initW, initW],
        aspectRatio: .99,
        onChange: showCoords,
        onSelect: showCoords
    });
    $('#photoAP').val(json.photoAP);
}

function showCoords(c){
    $('#x').val(c.x);
    $('#y').val(c.y);
    $('#w').val(c.w);
    $('#h').val(c.h);
};

function uploadProgress(file, complete, total){
    $('.upload span').text('已上传：' + Math.floor(complete / total) * 100 + '%');
}

function uploadError(object, code, message){
    alert(message);
}

function bindButtons(){
    $('.login_form button.reg').click(doReg);
}

function doReg(){
    $('#popup').html('  	<a class="close"></a>\
	<div class="register">\
	  <h2 class="bar"><span>用户注册</span></h2>\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>昵称：</label>\
		  <input type="text" class="iptField" name="uname" />\
	  	</p>\
		<p>\
		  <label>密码：</label>\
		  <input type="password" class="iptField" name="upwd" />\
		</p>\
		<p>\
		  <label>确认密码：</label>\
		  <input type="password" class="iptField" name="pwd2" />\
		</p>\
		<p class="inline">\
		  <input type="checkbox" class="iptchk" name="terms" id="cbTerms" checked="checked" />\
		  <label for="cbTerms">我已阅读并同意 <a href="terms_policy.jsp" target="_blank">宜家社区注册协议和隐私政策</a></label>\
		</p>\
		<p><button type="submit" class="gbtn next"><span>下一步</span></button></p>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
    showPopup('other');
    $('#popup input:first').focus();
    var value1;
    $('#popup form').submit(function(){
        var errArray = [];
        value1 = $('#popup form').serializeObject();
        if ($.trim(value1.uname) == '') {
            errArray.push('请输入昵称。')
        }
        var ps = $.trim(value1.upwd);
        if (ps == '') {
            errArray.push('请输入密码。');
        }
        if (ps.length < 6) {
            errArray.push('您输入的密码太短，至少6位。');
        }
        if ($.trim(value1.pwd2) == '') {
            errArray.push('请输入确认密码。');
        }
        if (value1.upwd != value1.pwd2) {
            errArray.push('再次输入的密码与之前输入不匹配。');
            $('#popup input[name="rpwd"]').val('');
        }
        if (!value1.terms) {
            errArray.push('您必须同意宜家社区注册协议和隐私政策。');
        }
        if (errArray.length > 0) {
            showErr(errArray);
            return false;
        } else {
            $.getJSON(path_root + 'isExist.action', {
                uname: value1.uname,
                seed: Math.random()
            }, function(data){
                if (data.ajaxMSG) {
                    showErr([data.ajaxMSG]);
                } else {
                    $('#popup').html('  	<a class="close"></a>\
	<div class="register">\
	  <h2 class="bar"><span>用户注册</span></h2>\
	  <form action="" method="post">\
	  	<p>若您已是宜家俱乐部会员，选择绑定会员卡，成为认证会员。</p>\
		<p><button type="submit" class="gbtn card" accesskey="c"><span>绑定会员卡</span></button></p>\
 	  	<p>若您选择不绑定会员卡，或尚未成为宜家俱乐部会员，请填写并验证邮箱完成注册。</p>\
		<p><button type="button" class="gbtn mail" accesskey="m"><span>验证邮箱</span></button></p>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
                    showPopup('other');
                    $('#popup form button.card').focus();
                    $('#popup form').submit(function(){
                        bindCard(value1);
                        return false;
                    });
                    $('#popup form button.mail').click(function(){
                        bindMail(value1);
                    });
                }
            });
        }
        return false;
    });
    return false;
}

function bindCard(old){
    $('#popup').html('  	<a class="close"></a>\
	<div class="register">\
	  <h2 class="bar"><span>用户注册</span></h2>\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>会员姓名：</label>\
		  <input type="text" class="iptField" name="urname" />\
	  	</p>\
		<p>\
		  <label>会员卡号：</label>\
		  <input type="text" class="iptField" name="mcardid" />\
		</p>\
		<p>\
		  <label>验证码：</label>\
		  <input type="text" class="tinyField" maxlength="5" name="vercode" />\
		  <span class="desc">请输入下面图片中的字符，不区分大小写</span>\
		</p>\
		<p><a class="kaptcha"><img src="' + path_root + 'kaptcha.jpg?' + Math.random() + '" alt="点击图片刷新" title="点击图片刷新" /></a></p>\
		<p><button type="submit" class="gbtn reg"><span>注册</span></button></p>\
		<input type="hidden" name="regType" value="1"/>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
    $('.kaptcha').click(newKaptcha);
    showPopup('other');
    $('#popup input:first').focus();
    $('#popup form').submit(function(){
        var errArray = [];
        var value2 = $(this).serializeObject();
        if ($.trim(value2.urname) == '') {
            errArray.push('请输入会员姓名。');
        }
        if ($.trim(value2.mcardid) == '') {
            errArray.push('请输入会员卡号。');
        }
        if ($.trim(value2.vercode) == '') {
            errArray.push('请输入验证码。');
        }
        if (errArray.length > 0) {
            showErr(errArray);
            return false;
        } else {
            $.post(path_root + 'register1.action', value2, function(data){
                if (data.ajaxMSG) {
                    newKaptcha();
                    showErr([data.ajaxMSG]);
                } else {
                    var duplicate = false;
                    if (data.gtmailMSG) {
                        duplicate = true;
                    }
                    $('#popup').html('  	<a class="close"></a>\
	<div class="register">\
	  <h2 class="bar"><span>用户注册</span></h2>\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>电子邮箱：</label>\
		  <input type="text" class="iptField" name="uemail" />\
	  	</p>\
		<p><button type="submit" class="gbtn ok"><span>确认</span></button></p>\
		<input type="hidden" name="regType" value="1"/>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
                    if (duplicate) {
                        $('#popup form').before('<p>您的会员卡相关邮箱已被注册，请输入新邮箱。</p>');
                    }
                    showPopup('other');
                    $('#popup form input[name="uemail"]').val(data.uemail);
                    $('#popup form').append('<input type="hidden" name="uname" value="' + old.uname + '"/><input type="hidden" name="upwd" value="' + old.upwd + '"/>');
                    $('#popup form').append('<input type="hidden" name="urname" value="' + value2.urname + '"/><input type="hidden" name="mcardid" value="' + value2.mcardid + '"/>');
                    $('#popup form').submit(function(){
                        var errArray = [];
                        var value3 = $(this).serializeObject();
                        if ($.trim(value3.uemail) == '') {
                            errArray.push('电子邮箱不能为空。');
                        } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value3.uemail)) {
                            errArray.push('电子邮箱格式错误，请重试。');
                        }
                        if (errArray.length > 0) {
                            showErr(errArray);
                            return false;
                        } else {
                            $.post(path_root + 'register2.action', value3, function(data){
                                if (data.ajaxMSG) {
                                    showErr([data.ajaxMSG]);
                                } else {
                                    $('#popup').html('  	<a class="close"></a>\
	<div class="forget" style="width:238px">\
	  <p>您的宜家俱乐部会员卡已绑定，系统已发送一封验证邮件至您的电子邮箱，点击邮件内链接即可完成注册，并即刻升级为认证会员。</p>\
	  <p>*如您未收到此邮件，请发送邮件至community@ikea.com联系我们。</p>\
	  <p>*请注意信件是否被归为垃圾邮件。</p>\
	</div>');
                                    showPopup('other');
                                }
                            });
                        }
                        return false;
                    });
                }
            }, 'json');
        }
        return false;
    });
}

function bindMail(old){
    $('#popup').html('  	<a class="close"></a>\
	<div class="register">\
	  <h2 class="bar"><span>用户注册</span></h2>\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>电子邮箱：</label>\
		  <input type="text" class="iptField" name="uemail" />\
	  	</p>\
		<p>\
		  <label>验证码：</label>\
		  <input type="text" class="tinyField" maxlength="5" name="vercode" />\
		  <span class="desc">请输入下面图片中的字符，不区分大小写</span>\
		</p>\
		<p><a class="kaptcha"><img src="' + path_root + 'kaptcha.jpg?' + Math.random() + '" alt="点击图片刷新" title="点击图片刷新" /></a></p>\
		<p><button type="submit" class="gbtn reg"><span>注册</span></button></p>\
		<input type="hidden" name="regType" value="2"/>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
    $('#popup form').append('<input type="hidden" name="uname" value="' + old.uname + '"/><input type="hidden" name="upwd" value="' + old.upwd + '"/>');
    $('.kaptcha').click(newKaptcha);
    showPopup('other');
    $('#popup input:first').focus();
    $('#popup form').submit(function(){
        var errArray = [];
        var value2 = $(this).serializeObject();
        if ($.trim(value2.uemail) == '') {
            errArray.push('请输入电子邮箱。');
        } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value2.uemail)) {
            errArray.push('您输入的邮箱格式不正确，请重试。');
        }
        if ($.trim(value2.vercode) == '') {
            errArray.push('请输入验证码。');
        }
        if (errArray.length > 0) {
            showErr(errArray);
            return false;
        } else {
            $.post(path_root + 'register2.action', value2, function(data){
                if (data.ajaxMSG) {
                    newKaptcha();
                    showErr([data.ajaxMSG]);
                } else {
                    $('#popup').html('  	<a class="close"></a>\
	<div class="forget" style="width:238px">\
	  <p>系统已发送一封验证邮件至您的电子邮箱，点击邮件内链接绑定邮箱，完成注册。</p>\
	  <p>*如您未收到此邮件，请发送邮件至community@ikea.com联系我们。</p>\
	  <p>*请注意信件是否被归为垃圾邮件。</p>\
	</div>');
                    showPopup('other');
                }
            }, 'json');
        }
        return false;
    });
}

function doSignin(uname, loginType){
    $('#popup').html('  	<a class="close"></a>\
	<div class="signin">\
	  <h2 class="bar"><span>用户登录</span></h2>\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>登录名：</label>\
		  <select name="loginType">\
		    <option value="1">昵称</option>\
			<option value="2">会员卡</option>\
			<option value="4">邮箱</option>\
		  </select>\
		  <input type="text" class="iptField uname" name="uname" />\
	  	</p>\
		<p>\
		  <label>密码：</label>\
		  <input type="password" class="iptField" name="upwd" />\
		</p>\
		<p>\
		  <label>验证码：</label>\
		  <input type="text" class="tinyField" maxlength="5" name="vercode" />\
		  <span class="desc">请输入下面图片中的字符，不区分大小写</span>\
		</p>\
		<p><a class="kaptcha"><img src="' + path_root + 'kaptcha.jpg?' + Math.random() + '" alt="点击图片刷新" title="点击图片刷新" /></a></p>\
		<dl>\
	      <dd class="lfloat"><input type="checkbox" id="ipt_remember2" class="iptchk" value="on"  /><label for="ipt_remember2">记住密码</label></dd>\
		  <dd class="lfloat">*<a href="#findmypass" id="findPass">忘记密码</a></dd>\
		  <dd class="lfloat cfloat"><button type="submit" class="gbtn submit"><span>立即登录</span></button></dd>\
		  <dd class="rfloat"><button type="button" class="gbtn regnew highlight"><span>注册新用户</span></button></dd>\
		</dl>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
    showPopup('other');
    if ($.type(uname) == 'string') {
        $('#popup input[name="uname"]').val(uname);
        $('#popup select').val(loginType);
    }
    var saved = $.cookie('ikea_authstr');
    if (saved) {
        var p = saved.split(',');
        $('#userSignin input[name="upwd"]').val(p[2]);
        $('#ipt_remember2').attr('checked', 'checked');
    }
    $('.kaptcha').click(newKaptcha);
    $('#popup input:first').focus();
    $('#popup form select').val(loginType).change(function(){
        $(this).next('input').val('').focus();
    });
    $('#popup form').submit(function(){
        var errArray = [];
        var values = $(this).serializeObject();
        if ($.trim(values.uname) == '') {
            errArray.push('请输入登录名。')
        }
        if ($.trim(values.upwd) == '') {
            errArray.push('请输入密码。')
        }
        if (values.vercode == '') {
            errArray.push('请输入验证码。')
        }
        if (errArray.length > 0) {
            showErr(errArray);
            return false;
        } else {
            $.post(path_root + 'ajaxLogin.action', $('#popup form').serialize(), function(data){
                if (data.ajaxMSG) {
                    newKaptcha();
                    showErr([data.ajaxMSG]);
                } else {
                    if ($('#ipt_remember2').get(0).checked) {
                        $.cookie('ikea_authstr', [values.loginType, values.uname, values.upwd].join(','), {
                            expires: 365
                        });
                    } else {
                        $.cookie('ikea_authstr', null);
                    }
                    window.location.reload();
                }
            }, 'json');
        }
        return false;
    });
    $('#popup button.regnew').click(function(){
        doReg();
    });
    $('#findPass').click(doFindPass);
    return false;
}

function doFindPass(){
    $('#popup').html('  	<a class="close"></a>\
	<div class="forgetForm">\
	  <h2 class="bar"><span>忘记密码</span></h2>\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>昵称：</label>\
		  <input type="text" class="iptField" name="uname" />\
	  	</p>\
		<p>\
		  <label>电子邮件：</label>\
		  <input type="text" class="iptField" name="uemail" />\
		</p>\
		<p>\
		  <label>验证码：</label>\
		  <input type="text" class="tinyField" maxlength="5" name="vercode" />\
		  <span class="desc">请输入下面图片中的字符，不区分大小写</span>\
		</p>\
		<p><a class="kaptcha"><img src="' + path_root + 'kaptcha.jpg?' + Math.random() + '" alt="点击图片刷新" title="点击图片刷新" /></a></p>\
		<p><button type="submit" class="gbtn submit"><span>提交</span></button></p>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
    showPopup('other');
    $('.kaptcha').click(newKaptcha);
    $('#popup input:first').focus();
    $('#popup form').submit(function(){
        var errArray = [];
        var values = $('#popup form').serializeObject();
        if ($.trim(values.uname) == '') {
            errArray.push('请输入昵称。')
        }
        if ($.trim(values.uemail) == '') {
            errArray.push('请输入电子邮件。')
        }
        if (values.vercode == '') {
            errArray.push('请输入验证码。')
        }
        if (errArray.length > 0) {
            showErr(errArray);
            return false;
        } else {
            $.post(path_root + 'findpwd.action', $('#popup form').serialize(), function(data){
                if (data.ajaxMSG) {
                    showPopup('error', '<p>' + data.ajaxMSG + '<p>');
                    return false;
                } else {
                    $('#popup').html('  	<a class="close"></a>\
	<div class="forget">\
	  <p>我们已将一封包含重置密码链接的邮件送到您的邮箱 ' + values.uemail + ' 中，请查收。</p>\
	  <p>*如您未收到此邮件，请发送邮件至community@ikea.com联系我们。</p>\
	</div>');
                    centerPopup();
                    showPopup('other');
                }
            }, 'json');
        }
        return false;
    });
}

function addCard(){
    $('#addCard').submit(function(){
        var v1 = $(this).serializeObject();
        if ($.trim(v1.mcardid) == '') {
            showPopup('error', '<p>请输入会员卡号。<p>');
            return false;
        }
        if ($.trim(v1.urname) == '') {
            showPopup('error', '<p>请输入会员姓名。<p>');
            return false;
        }
        $.post(path_root + 'binding1.action', v1, function(data){
            if (data.ajaxMSG) {
                showPopup('error', '<p>' + data.ajaxMSG + '<p>');
                return false;
            } else {
                if (!data.bindMSG) {
                    showPopup('success', '<p>宜家俱乐部会员卡绑定成功！</p>', function(){
                        window.location.reload();
                    });
                } else {
                    $('#popup').html('  	<a class="close"></a>\
	<div class="register">\
	  <form action="" method="post">\
	  	<p>\
	  	  <label>电子邮箱：</label>\
		  <input type="text" class="iptField" name="uemail" />\
	  	</p>\
		<dl class="yesno">\
		  <dd class="lfloat"><button type="submit" class="gbtn yes"><span>是</span></button></dd>\
		  <dd class="rfloat"><button type="button" class="gbtn no"><span>否</span></button></dd>\
		</dl>\
		<dl class="mnh">\
		  <dd class="lfloat"><button type="submit" class="gbtn modify"><span>更改</span></button></dd>\
		  <dd class="rfloat"><button type="button" class="gbtn hold"><span>保留现有邮箱</span></button></dd>\
		</dl>\
		<input type="hidden" name="regType" value="1"/>\
	  </form>\
	  <div class="errMsg"></div>\
	</div>');
                    $('#popup form').append('<input type="hidden" name="typeid" id="typeid" />');
                    switch (data.bindMSG) {
                        case '1':
                            $('#popup form').before('<p>您的会员卡相关邮箱已被注册，请输入新邮箱或者继续使用目前绑定的邮箱。</p>');
                            $('#popup form .yesno').hide();
                            $('#typeid').val('1');
                            break;
                        case '2':
                            $('#popup form .mnh').hide();
                            $('#popup form').before('<p>是否用您的会员卡相关邮箱 ' + data.uemail + ' 替换已绑定的邮箱？</p>');
                            $('#popup form input:first').val(data.uemail);
                            $('#typeid').val('2');
                            break;
                        default:
                            break;
                    }
                    showPopup('other');
                    $('#popup form').append('<input type="hidden" name="mcardid" value="' + v1.mcardid + '"/><input type="hidden" name="urname" value="' + v1.urname + '"/>');
                    $('#popup form').submit(function(){
                        var v2 = $(this).serializeObject();
                        if ($('#typeid').val() == '1') {
                            $.post(path_root + 'binding2.action', v2, function(data){
                                if (data.ajaxMSG) {
                                    showErr([data.ajaxMSG]);
                                    return false;
                                } else {
                                    showPopup('success', '<p>宜家俱乐部会员卡绑定成功！</p>', function(){
                                        window.location.reload();
                                    });
                                }
                            });
                        } else if ($('#typeid').val() == '2') {
                            $.post(path_root + 'binding2.action', v2, function(data){
                                if (data.ajaxMSG) {
                                    showErr([data.ajaxMSG]);
                                    return false;
                                } else {
                                    $('#popup').html('  	<a class="close"></a>\
	<div class="forget" style="width:238px">\
	  <p>系统已发送一封验证邮件至您的电子邮箱，点击邮件内链接绑定邮箱，完成注册。</p>\
	  <p>*如您未收到此邮件，请发送邮件至community@ikea.com联系我们。</p>\
	  <p>*请注意信件是否被归为垃圾邮件。</p>\
	</div>');
                                    showPopup('other', '', function(){
                                        window.location.reload();
                                    });
                                }
                            });
                        }
                        return false;
                    });
                    $('#popup form button[type="button"]').click(function(){
                        showPopup('success', '<p>宜家俱乐部会员卡绑定成功！</p>', function(){
                            window.location.reload();
                        });
                    });
                }
            }
        });
        return false;
    });
}

function showErr(arr){
    $('#popup .errMsg').text('');
    $(arr).each(function(){
        $('#popup .errMsg').append('<p>* ' + this + '</p>');
    });
}

function newKaptcha(){
    var src = $('.kaptcha img').attr('src');
    var newSrc = src.split('?')[0] + '?' + Math.random();
    $('.kaptcha img').attr('src', newSrc);
    $('input[name="vercode"]').val('').focus();
}

function initTab(){
    $('.tab a').mouseover(function(){
        if (!$(this).hasClass('disable') && !$(this).hasClass('on')) {
            var parts = $(this).children('img').attr('src').split('.');
            var src = parts[0].split('_');
            if (src[src.length - 1] != 'on') {
                var url = parts[0] + '_on.' + parts[1];
                $(this).children('img').attr('src', url);
            }
        }
    });
    $('.tab a').mouseout(function(){
        if (!$(this).hasClass('disable') && !$(this).hasClass('on')) {
            var parts = $(this).children('img').attr('src').split('.');
            var src = parts[0].split('_');
            if (src[src.length - 1] == 'on') {
                var url = '';
                for (i = 0; i < src.length - 1; i++) {
                    if (i > 0) {
                        url += '_';
                    }
                    url += src[i];
                }
                url += '.' + parts[1];
                $(this).children('img').attr('src', url);
            }
        }
    });
}

function eventTemp(){
    $('.subTab a').each(function(i, a){
        $(a).click(function(){
            $('.subTab li.on').removeClass('on');
            $(this).parent('li').addClass('on');
            $('.subTab').next('p').removeClass().addClass('subarr t' + i);
        });
    });
}
