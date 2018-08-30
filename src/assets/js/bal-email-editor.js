var _content = $('.bal-content');
var _menu = $('.bal-left-menu-container');
var _is_demo=true;
$(function() {
    /*Nicescroll*/
    $(".bal-elements-container").niceScroll({
        cursorcolor: "#5D8397",
        cursorwidth: "10px",
        background: "#253843"
    });
    //$(".bal-elements-container").css({'overflow':''});
    /*for the tooltip*/
    $('[data-toggle="tooltip"]').tooltip();
    /*accordion*/
    _menu.find('.bal-elements-accordion .bal-elements-accordion-item-title').on('click', function(j) {
        _element = $(this);
        _menuAccordionClick(_element, false);
    });
    _menu.find('.tab-selector').on('click', function() {
        _element = $(this);
        _tabMenuItemClick(_element, true);
    });
    _menu.find('.blank-page').on('click',function () {
      _element = $(this);
      $('.bal-content-main').html('<div class="email-editor-elements-sortable ui-sortable"><div class="bal-elements-list-item ui-draggable ui-draggable-handle" style="width: auto; height: auto;"><div class="sortable-row"><div class="sortable-row-container"><div class="sortable-row-actions"><div class="row-move row-action"><i class="fa fa-arrows-alt"></i></div><div class="row-remove row-action"><i class="fa fa-remove"></i></div><div class="row-duplicate row-action"><i class="fa fa-files-o"></i></div></div><div class="sortable-row-content"><table class="main" width="100%" cellspacing="0" cellpadding="0" border="0" data-types="background,border-radius,text-style,padding" data-last-type="text-style" style="background-color:#FFFFFF" align="center"><tbody><tr><td class="element-content" align="left" style="padding-left:50px;padding-right:50px;padding-top:10px;padding-bottom:10px;font-family:Arial;font-size:13px;color:#000000;line-height:22px"><div contenteditable="true" class="test-text" style="text-align: center;"><span style="text-align: center;">Drag elements from left menu</span></div></td></tr></tbody></table></div></div></div></div></div>');
      makeSortable();
    });
    _menu.find('.bal-collapse').on('click', function() {
        _element = $(this);
        _dataValue = _element.attr('data-value');
        //console.log(_dataValue);
        if (_dataValue === 'closed') {
            $('.bal-left-menu-container').animate({
                width: 380
            }, 300, function() {
                $('.bal-elements').show();
                $('.bal-content').css({
                    'padding-left': '380px'
                });
                $('.bal-left-menu-container').find('.bal-menu-item:eq(0)').addClass('active');
            });
            _element.find('.bal-menu-name').show();
            _element.find('.fa').removeClass().addClass('fa fa-chevron-circle-left');
            _element.attr('data-value', 'opened');
        } else {
            $('.bal-left-menu-container').animate({
                width: 70
            }, 300, function() {
                $('.bal-elements').hide();
                $('.bal-left-menu-container').find('.bal-menu-item.active').removeClass('active');
            });
            $('.bal-content').css({
                'padding-left': '70px'
            });
            _element.find('.bal-menu-name').hide();
            _element.find('.fa').removeClass().addClass('fa fa-chevron-circle-right');
            _element.attr('data-value', 'closed');
        }
    });
    /*for selecting first tab first accordion*/
    /*drag drop*/
    makeSortable();
    _menu.find(".bal-elements-list .bal-elements-list-item").draggable({
        connectToSortable: ".email-editor-elements-sortable",
        helper: "clone",
        //revert: "invalid",
        create: function(event, ui) {
            //console.log(event.target);
        },
        drag: function(event, ui) {
            //console.log(ui.helper);
        },
        start: function(event, ui) {
            $(".bal-elements-container").css({'overflow':''});
            ui.helper.find('.bal-preview').hide();
            ui.helper.find('.bal-view').show()
                //$(this).find('.demo').show();
        },
        stop: function(event, ui) {
            //ui.helper.find('.demo').hide()
            //$(this).find('.demo').hide();
            //ui.helper.find('.configrutaion,.preview').hide()
            //console.log('ddd')
            $(".bal-elements-container").css({'overflow':'hidden'});
            ui.helper.html(ui.helper.find('.bal-view').html());
            $('.email-editor-elements-sortable .bal-elements-list-item').css({
                'width': 'auto',
                'height': 'auto'
            });
          //  $('.email-editor-elements-sortable .bal-elements-list-item').removeClass('bal-elements-list-item ui-draggable ui-draggable-handle');
        }
    });
    /*elements*/
    //text style
    _menu.find('.bal-text-icons .bal-icon-box-item').on('click', function() {
        _element = $(this);
        if (_element.hasClass('active')) {
            _element.removeClass('active');
        } else {
            _element.addClass('active');
        }
        if (_menu.find('.bal-text-icons .bal-icon-box-item.fontStyle').hasClass('active')) {
            changeSettings('font-style', 'italic');
        } else {
            changeSettings('font-style', '');
        }
        _value = '';
        if (_menu.find('.bal-text-icons .bal-icon-box-item.underline').hasClass('active')) {
            _value += 'underline ';
        }
        if (_menu.find('.bal-text-icons .bal-icon-box-item.line').hasClass('active')) {
            _value += ' line-through';
        }
        changeSettings('text-decoration', _value);
    });
    _menu.find('.bal-font-icons .bal-icon-box-item').on('click', function() {
        _element = $(this);
        if (_element.hasClass('active')) {
            _element.removeClass('active');
        } else {
            _element.addClass('active');
        }
        if (_menu.find('.bal-font-icons .bal-icon-box-item').hasClass('active')) {
            changeSettings('font-weight', 'bold');
        } else {
            changeSettings('font-weight', '');
        }
    });
    _menu.find('.bal-align-icons .bal-icon-box-item').on('click', function() {
        _element = $(this);
        _menu.find('.bal-align-icons .bal-icon-box-item').removeClass('active');
        _element.addClass('active');
        _value = 'left';
        if (_menu.find('.bal-align-icons .bal-icon-box-item.center').hasClass('active')) {
            _value = 'center';
        }
        if (_menu.find('.bal-align-icons .bal-icon-box-item.right').hasClass('active')) {
            _value = 'right';
        }
        changeSettings('text-align', _value);
    });
    /* colorpicker */
    $('#bg-color').ColorPicker({
        color: '#fff',
        onChange: function(hsb, hex, rgb) {
            $('#bg-color').css('background-color', '#' + hex);
            changeSettings($('#bg-color').attr('setting-type'), '#' + hex);
        }
    });
    $('#text-color').ColorPicker({
        color: '#000',
        onChange: function(hsb, hex, rgb) {
            $('#text-color').css('background-color', '#' + hex);
            changeSettings($('#text-color').attr('setting-type'), '#' + hex);
        }
    });
    $('.bal-content-wrapper').click();
    _tabMenu('typography');


    _aceEditor = ace.edit("editorHtml");
    _aceEditor.setTheme("ace/theme/monokai");
    _aceEditor.getSession().setMode("ace/mode/html");

});
var _aceEditor;
function makeSortable() {
  $(".email-editor-elements-sortable").sortable({
      //revert: true,
      group: 'no-drop',
      handle: '.row-move'
          // ,scroll: false
          // , tolerance: "pointer"
          //,axis: "y"
  });
}
//change settings
$(document).on('keyup', '.bal-left-menu-container .form-control', function() {
    _element = $(this);
    if (_element.hasClass('all') && _element.hasClass('padding')) {
        _menu.find('.padding:not(".all")').val(_element.val());
    }
    if (_element.hasClass('all') && _element.hasClass('border-radius')) {
        _menu.find('.border-radius:not(".all")').val(_element.val());
    }
    changeSettings(_element.attr('setting-type'), _element.val() + 'px');
});
$(document).on('change', '.bal-left-menu-container  .form-control', function() {
    _element = $(this);
    changeSettings(_element.attr('setting-type'), _element.val());
});
//her elementin edit olunan contenti varsa birbasa onun icin edit edey
$(document).on('click', '[contenteditable="true"]', function(event) {
    $('.bal-content-wrapper').removeClass('active');
    _content.find('[contenteditable="true"]').removeClass('element-contenteditable active')
    $(this).addClass('element-contenteditable active');
    _sortableClick($(this));
    _menuEditor($(this), event);
    event.stopPropagation();
});
$(document).on('click', '.element-content', function(event) {
    $('.bal-content-wrapper').removeClass('active');
    _content.find('[contenteditable="true"]').removeClass('element-contenteditable active');
    _sortableClick($(this));
    _menuEditor($(this), event);
    event.stopPropagation();
});
function _sortableClick(_this) {
    _element = _this.parents('.sortable-row');
    //select current item
    _content.find('.sortable-row').removeClass('active')
    _element.addClass('active');
    _dataTypes = _element.find('.sortable-row-content .main').attr('data-types');
    if (_dataTypes.length < 1) {
        return;
    }
    _typeArr = _dataTypes.toString().split(',');
    _arrSize = _menu.find('.tab-property .bal-elements-accordion-item').length;
    for (var i = 0; i < _arrSize; i++) {
        _accordionMenuItem = _menu.find('.tab-property .bal-elements-accordion-item').eq(i);
        //console.log(_accordionMenuItem.attr('data-type'))
        if (_dataTypes.indexOf(_accordionMenuItem.attr('data-type')) > -1) {
            _accordionMenuItem.show();
        } else {
            _accordionMenuItem.hide();
        }
    }
    _tabMenu(_element.find('.sortable-row-content .main').attr('data-last-type'));
    getSettings();
}
//left menu all items
const _tabMenuItems = {
    //elements tab
    'typography': {
        itemSelector: 'typography',
        parentSelector: 'tab-elements'
    },
    'media': {
        itemSelector: 'media',
        parentSelector: 'tab-elements'
    },
    'layout': {
        itemSelector: 'layout',
        parentSelector: 'tab-elements'
    },
    'button': {
        itemSelector: 'button',
        parentSelector: 'tab-elements'
    },
    'social': {
        itemSelector: 'social',
        parentSelector: 'tab-elements'
    },
    //property tab
    'background': {
        itemSelector: 'background',
        parentSelector: 'tab-property'
    },
    'border-radius': {
        itemSelector: 'border-radius',
        parentSelector: 'tab-property'
    },
    'text-style': {
        itemSelector: 'text-style',
        parentSelector: 'tab-property'
    },
    'padding': {
        itemSelector: 'padding',
        parentSelector: 'tab-property'
    },
    'youtube-frame': {
        itemSelector: 'youtube-frame',
        parentSelector: 'tab-property'
    },
    'hyperlink': {
        itemSelector: 'hyperlink',
        parentSelector: 'tab-property'
    },
    'image-settings': {
        itemSelector: 'image-settings',
        parentSelector: 'tab-property'
    },
    'social-content': {
        itemSelector: 'social-content',
        parentSelector: 'tab-property'
    }
}
//open/close menu
function _tabMenu(tab) {
    _menuItem = _tabMenuItems[tab];
    _tabMenuItem = $('.bal-left-menu-container .bal-menu-item[data-tab-selector="' + _menuItem.parentSelector + '"]');
    _accordionMenuItem = $('.bal-elements-accordion .bal-elements-accordion-item[data-type="' + _menuItem.itemSelector + '"] .bal-elements-accordion-item-title');
    _tabMenuItemClick(_tabMenuItem, true);
    _menuAccordionClick(_accordionMenuItem, false);
}
//left tab menu
function _tabMenuItemClick(_element, handle) {
    _tabSelector = _element.data('tab-selector');
    if (_element.hasClass('bal-collapse')) {
        return false;
    }
    _menu.find('.bal-menu-item.active').removeClass('active');
    _menu.find('.bal-element-tab.active').removeClass('active');
    //show tab content
    _menu.find('.' + _tabSelector).addClass('active');
    //select new tab
    _element.addClass('active');
    if (!handle) {
        _content.find('.sortable-row.active').removeClass('active');
    }
}
//left menu accordion
function _menuAccordionClick(_element, toggle) {
    var dropDown = _element.closest('.bal-elements-accordion-item').find('.bal-elements-accordion-item-content');
    _element.closest('.bal-elements-accordion').find('.bal-elements-accordion-item-content').not(dropDown).slideUp();
    if ($('.tab-property').hasClass('active')) {
        _content.find('.sortable-row.active .main').attr('data-last-type', _element.closest('.bal-elements-accordion-item').attr('data-type'));
    }
    if (!toggle) {
        _element.closest('.bal-elements-accordion').find('.bal-elements-accordion-item-title.active').removeClass('active');
        _element.addClass('active');
        dropDown.stop(false, true).slideDown();
    } else {
        if (_element.hasClass('active')) {
            _element.removeClass('active');
        } else {
            _element.closest('.bal-elements-accordion').find('.bal-elements-accordion-item-title.active').removeClass('active');
            _element.addClass('active');
        }
        dropDown.stop(false, true).slideToggle();
    }
}
//change every settings
function changeSettings(type, value) {
    _activeElement = getActiveElementContent();
    if (type == 'font-size') {
        _activeElement.find('>h1,>h4').css(type, value);
    } else if (type == 'background-image') {
        _activeElement.css(type, 'url("' + value + '")');
        _activeElement.css({
            'background-size': 'cover',
            'background-repeat': 'no-repeat'
        });
    }
    _activeElement.css(type, value);
}
//get active element of email content
function getActiveElementContent() {
    //_selector = '.main';
    //switch (dataType) {
    //    case 'background':
    //        _selector = '.main';
    //        break;
    //    case 'padding':
    //    case 'padding-left':
    //    case 'padding-right':
    //    case 'padding-top':
    //    case 'padding-bottom':
    //        _selector = '.element-content';
    //        break;
    //    default:
    //        _selector = '.main';
    //        break;
    //}
    _element = _content.find('.sortable-row.active .sortable-row-content .element-content');
    //element-contenteditable active
    if (_element.find('[contenteditable="true"]').hasClass('element-contenteditable')) {
        _element = _element.find('.element-contenteditable.active');
    }
    if ($('.bal-content-wrapper').hasClass('active')) {
        _element = $('.bal-content-wrapper');
    }
    return _element;
}
//get active element settings
function getSettings() {
    _element = getActiveElementContent();
    _style = _element.attr('style');
    if (typeof _style === "undefined" || _style.length < 1) {
        return;
    }
    //background
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="background-color"]').css('background-color', _element.css('background-color'));
    /*Paddings*/
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="padding-top"]').val(_element.css('padding-top').replace('px', ''));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="padding-bottom"]').val(_element.css('padding-bottom').replace('px', ''));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="padding-left"]').val(_element.css('padding-left').replace('px', ''));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="padding-right"]').val(_element.css('padding-right').replace('px', ''));
    /*Border radius*/
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="border-top-left-radius"]').val(_element.css('border-top-left-radius').replace('px', ''));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="border-top-right-radius"]').val(_element.css('border-top-right-radius').replace('px', ''));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="border-bottom-left-radius"]').val(_element.css('border-bottom-left-radius').replace('px', ''));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="border-bottom-right-radius"]').val(_element.css('border-bottom-right-radius').replace('px', ''));
    /*text style*/
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="font-family"]').val(_element.css('font-family'));
    _menu.find('.tab-property .bal-elements-accordion-item [setting-type="font-size"]').val(_element.css('font-size').replace('px', ''));
    //text color
    _menu.find('.tab-property .bal-icon-box-item[setting-type="color"]').css({
        'background': _element.css('color')
    });
    //text align
    _menu.find('.tab-property .bal-align-icons .bal-icon-box-item').removeClass('active');
    _menu.find('.tab-property .bal-align-icons .bal-icon-box-item.' + _element.css('text-align')).addClass('active');
    //text bold
    if (_element.css('font-weight') == 'bold') {
        _menu.find('.tab-property .bal-icon-box-item[setting-type="bold"]').addClass('active');
    } else {
        _menu.find('.tab-property .bal-icon-box-item[setting-type="bold"]').removeClass('active');
    }
    //text group style
    _menu.find('.tab-property .bal-text-icons .bal-icon-box-item').removeClass('active');
    if (_element.css('text-decoration').indexOf('underline') > -1) {
        _menu.find('.tab-property .bal-text-icons .bal-icon-box-item.underline').addClass('active');
    }
    if (_element.css('text-decoration').indexOf('line-through') > -1) {
        _menu.find('.tab-property .bal-text-icons .bal-icon-box-item.line').addClass('active');
    }
    if (_element.css('font-style').indexOf('italic') > -1) {
        _menu.find('.tab-property .bal-text-icons .bal-icon-box-item.fontStyle').addClass('active');
    }
    //_arr = _style.split(';');
    //for (var i = 0; i < _arr.length; i++) {
    //    _arrStyle = _arr[i].split(':');
    //    _item = _menu.find('.tab-property .bal-elements-accordion-item [setting-type="' + _arrStyle[0] + '"]');
    //    if (_item.is('input')) {
    //        _item.val(_arrStyle[1].replace('px', ''));
    //        console.log(_arrStyle[0]+'-'+_arrStyle[1].replace('px', ''))
    //    } else {
    //        _item.css(_arrStyle[0], _arrStyle[1]);
    //    }
    //    //.val(_arr[i].split(':')[1]);
    //}
    if (_element.hasClass('social-content')) {
        $('.bal-content .sortable-row.active .sortable-row-content .element-content.social-content a').each(function() {
            _socialType = $(this).attr('class');
            _socialRow = _menu.find('[data-social-type="' + _socialType + '"]');
            _socialRow.find('.social-input').val($(this).attr('href'));
            if ($(this).css('display') == 'none') {
                _socialRow.find('.checkbox-title input').prop("checked", false);
            } else {
                _socialRow.find('.checkbox-title input').prop("checked", true);
            }
        });
    }
    if (_element.hasClass('youtube-frame')) {
        _ytbUrl = _element.find('iframe').attr('src');
        _menu.find('.youtube').val(_ytbUrl.split('/')[4]);
    }

    //hyperlink
    if (_element.hasClass('hyperlink')) {
        _href = _element.attr('href');
        _menu.find('.hyperlink-url').val(_href);
    }
    //image size
    _menu.find('.tab-property .bal-elements-accordion-item .image-width').val(_element.find('.content-image').css('width'));
    _menu.find('.tab-property .bal-elements-accordion-item .image-height').val(_element.find('.content-image').css('height'));

}
$(document).on('keyup', '.image-size', function() {


  //  image-width number image-size
      _activeElement = getActiveElementContent();


    if ($(this).hasClass('image-height')) {
        console.log($(this).val()+' width');
      _activeElement.find('.content-image').css('height',$(this).val());
    } else if ($(this).hasClass('image-width')) {
      console.log($(this).val()+' width');
      _activeElement.find('.content-image').css('width',$(this).val());
    }

});
$(document).on('keydown', '.number', function(e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1
        //// Allow: Ctrl+A
        //(e.keyCode == 65 && e.ctrlKey === true) ||
        //// Allow: Ctrl+C
        //(e.keyCode == 67 && e.ctrlKey === true) ||
        //// Allow: Ctrl+X
        //(e.keyCode == 88 && e.ctrlKey === true) ||
        //// Allow: home, end, left, right
        //(e.keyCode >= 35 && e.keyCode <= 39)
    ) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});
$(document).on('keyup', '.bal-social-content-box .social-input', function() {
    _element = $(this);
    _socialType = _element.parents('.row').attr('data-social-type');
    _val = _element.val();
    _activeElement = getActiveElementContent();
    if (_activeElement.hasClass('social-content')) {
        _activeElement.find('a.' + _socialType).attr('href', _val);
    }
});
$(document).on('change', '.bal-social-content-box .checkbox-title input', function() {
    _socialType = $(this).parents('.row').attr('data-social-type');
    _activeElement = getActiveElementContent();
    if ($(this).is(":checked")) {
        _activeElement.find('a.' + _socialType).show();
    } else {
        _activeElement.find('a.' + _socialType).hide();
    }
});
//bu silinecey, popup acilib icinde sekil yuklemey olacag
$(document).on('click', '.bg-image', function() {
    changeSettings($(this).attr('setting-type'), 'assets/images/demo.jpg');
});
/*for remove action*/
$(document).on('click', '.sortable-row .row-remove', function() {
    if (_content.find('.sortable-row').length == 1) {
        alert('At least should be 1 item')
        return;
    }
    $(this).parents('.sortable-row').remove();
});
/*for inline edit action*/
$(document).on('click', '.sortable-row .row-code', function() {
  $(this).parents('.sortable-row').addClass('code-editor');
  _html=$(this).parents('.sortable-row').find('.sortable-row-content').html();
  _aceEditor.session.setValue(_html);
  $('#popup_editor').modal('show');
});

/*for dublicate action*/
$(document).on('click', '.sortable-row .row-duplicate', function() {
    if ($(this).hasParent('.bal-elements-list-item')) {
        _parentSelector = '.bal-elements-list-item';
    }else {
        _parentSelector = '.sortable-row';
    }
    _parent = $(this).parents(_parentSelector);
    $('.sortable-row').removeClass('active');
    $('.bal-elements-list-item').removeClass('active');
    _parent.addClass('active');
    //_parent.after('<div class="sortable-row">'+ _parent.html()+"</div>");
    _parent.clone().insertAfter(_parentSelector+'.active');
});
$.fn.hasParent=function(e){
   return ($(this).parents(e).length==1?true:false);
}
$(document).on('click', '.bal-setting-item.other-devices', function() {
    _parent = $(this).parents('.bal-settings');
    if ($(this).hasClass('active')) {
        _parent.find('.bal-setting-content .bal-setting-content-item.other-devices').hide();
        $(this).removeClass('active');
    } else {
        _parent.find('.bal-setting-content .bal-setting-content-item.other-devices').show();
        $(this).addClass('active');
    }
});
$(document).on('click', '.bal-setting-content .bal-setting-device-tab', function() {
    _parent = $(this).parents('.bal-setting-content');
    _parent.find('.bal-setting-device-tab').removeClass('active');
    $(this).addClass('active');
    _parent.find('.bal-setting-device-content').removeClass('active');
    _parent.find('.bal-setting-device-content.' + $(this).attr('data-tab')).addClass('active');
    _removeClass = 'sm-width lg-width';
    _addClass = '';
    switch ($(this).attr('data-tab')) {
        case 'mobile-content':
            _addClass = 'sm-width';
            break;
        case 'desktop-content':
            _addClass = 'lg-width';
            break;
    }
    _content.find('.bal-content-main').removeClass(_removeClass);
    _content.find('.bal-content-main').addClass(_addClass);
});
$(document).on('click', '.bal-content-wrapper', function() {
    _content.find('.sortable-row.active').removeClass('active');
    _content.find('.sortable-row .element-contenteditable.active').removeClass('.element-contenteditable .active');
    $(this).addClass('active');
    _dataTypes = $(this).attr('data-types');
    if (_dataTypes.length < 1) {
        return;
    }
    _typeArr = _dataTypes.toString().split(',');
    _arrSize = _menu.find('.tab-property .bal-elements-accordion-item').length;
    for (var i = 0; i < _arrSize; i++) {
        _accordionMenuItem = _menu.find('.tab-property .bal-elements-accordion-item').eq(i);
        //console.log(_accordionMenuItem.attr('data-type'))
        if (_dataTypes.indexOf(_accordionMenuItem.attr('data-type')) > -1) {
            _accordionMenuItem.show();
        } else {
            _accordionMenuItem.hide();
        }
    }
      _menu.find('[setting-type="padding-top"]').val($(this).css('padding-top').replace('px',''));
      _menu.find('[setting-type="padding-bottom"]').val($(this).css('padding-bottom').replace('px',''));
      _menu.find('[setting-type="padding-left"]').val($(this).css('padding-left').replace('px',''));
      _menu.find('[setting-type="padding-right"]').val($(this).css('padding-right').replace('px',''));

      _menu.find('.email-width').val($('.bal-content-main').width());

    _tabMenu(_typeArr[0]);
});
$(document).on('keyup', '.bal-elements-accordion-item-content .youtube', function() {
    _element = $(this);
    _val = _element.val();
    _activeElement = getActiveElementContent();
    _activeElement.find('iframe').attr('src', 'https://www.youtube.com/embed/' + _val);
});
$(document).on('keyup', '.bal-elements-accordion-item-content .hyperlink-url', function() {
    _element = $(this);
    _val = _element.val();
    _activeElement = getActiveElementContent();
    _activeElement.attr('href', _val);
});
String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};
$(document).on('click', '.bal-setting-item.save-template', function() {
    if (_is_demo) {
      $('#popup_demo').modal('show');
      return;
    }
    $('.input-error').text('');
    $('.template-name').val('');
    $('#popup_save_template').modal('show');
});
$(document).on('click', '.bal-setting-item.load-templates', function() {
      loadTemplates();
    $('#popup_load_template').modal('show');
});
$(document).on('click', '.bal-setting-item.send-email', function() {
    $('.recipient-email').val('');
    $('.popup_send_email_output').text('');
    $('#popup_send_email').modal('show');
});
$(document).on('click', '.btn-send-email-template', function() {
    _element=$(this);
    if ($(this).hasClass('has-loading')) {
      return;
    }

    _element.addClass('has-loading');
    _element.text('Loading...');

    _email  = $('.recipient-email').val();
    _result = getContentHtml();

    output=$('.popup_send_email_output');

    $.ajax({
        url: 'send.php',
        type: 'POST',
        data: {
            html: _result,
            mail: _email
        },
        dataType: 'json',
        success: function(data) {
          if (data.code==0) {
            output.css('color','green');
          }else {
            output.css('color','red');
          }

          _element.removeClass('has-loading');
          _element.text('Send Email');

          output.text(data.message);
        },
        error: function() {
          output.text('Internal error');
        }
    });


});

//for export email form
$(document).on('click', '.bal-setting-item.export', function() {
    _settingsClick('export');
});
//for creating preview html
$(document).on('click', '.bal-setting-item.preview', function() {
    _settingsClick('preview');
});
function getContentHtml(){
    _html = '';
    $('.bal-content .bal-content-wrapper .sortable-row').each(function() {
        _html += $(this).find('.sortable-row-content').html().replaceAll('contenteditable="true"', '');
    });
    _width=$('.bal-content-main').css('width');
    _style = '';
    _style += 'background:' + $('.bal-content-wrapper').css('background') + ';';
    _style += 'padding:' + $('.bal-content-wrapper').css('padding');
   _result = '<div class="email-content" style="' + _style + '">' + _html + '</div>';

   _result = '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="' + _style + '"><tbody><tr><td><div style="margin:0 auto;width:'+_width+';">'+_html+'</div></td></tr></table>';
   return _result;
}


function _settingsClick(settingsType) {
   _result = getContentHtml();

    $.ajax({
        url: 'export.php',
        type: 'POST',
        data: {
            html: _result
        },
        dataType: 'json',
        success: function(data) {
            if (data.code==-5) {
              $('#popup_demo').modal('show');
              return;
            }else if (data.code == 0) {
                if (settingsType == 'export') {
                    window.location.href = data.url;
                }
                if (settingsType == 'preview') {
                    var win = window.open(data.preview_url, '_blank');
                    if (win) {
                        //Browser has allowed it to be opened
                        win.focus();
                    } else {
                        //Browser has blocked it
                        alert('Please allow popups for this website');
                    }
                }
            }
        },
        error: function() {}
    });
}
//for opening modal
$(document).on('click', '.change-image', function(e) {
    loadImages();
    $('#popup_images').modal('show');
    // _content.find('.content-image').removeClass('active');
    // $(this).addClass('active');
});
//when popup image click
$(document).on('click', '.upload-image-item', function() {
    $('.modal .upload-image-item').removeClass('active');
    $(this).addClass('active');
});
$(document).on('click', '.btn-select', function() {
    _url = $('.modal').find('.upload-image-item.active').attr('src');
    // _content.find('.content-image.active').attr('src', _url);
    // _content.find('.content-image.active').removeClass('active');
    getActiveElementContent().find('.content-image').attr('src', _url);

    $('#popup_images').modal('hide');
});
//upload image to server
$(document).on('click', '.modal .btn-upload', function() {
    var file_data = $('.input-file').prop('files')[0];
    var form_data = new FormData();
    form_data.append('file', file_data);
    $.ajax({
        url: 'upload.php', // point to server-side PHP script
        dataType: 'text', // what to expect back from the PHP script, if anything
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function(php_script_response) {
            loadImages();
        }
    });
});
//load all uploads files from server
function loadImages() {
    /*<div class="col-sm-4">
      <img src="fd" alt='' data-url=''>
     </div>*/
    $.ajax({
        url: 'get-files.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            if (data.code == 0) {
                _output = '';
                for (var k in data.files) {
                    if (typeof data.files[k] !== 'function') {
                        _output += "<div class='col-sm-3'>" +
                            "<img class='upload-image-item' src='" + data.directory + data.files[k] + "' alt='" + data.files[k] + "' data-url='" + data.directory + data.files[k] + "'>" +
                            "</div>";
                        // console.log("Key is " + k + ", value is" + data.files[k]);
                    }
                }
                $('.upload-images').html(_output);
            }
        },
        error: function() {}
    });
}
var _templateListItems;
function loadTemplates() {
  $('.template-list').html('<div style="text-align:center">Loading...</div>');
  $.ajax({
      url: 'load_templates.php',
      type: 'GET',
      dataType: 'json',
      success: function(data) {
          if (data.code == 0) {
            _templateItems='';
            _templateListItems=data.files;
            for (var i = 0; i < data.files.length; i++) {
                  _templateItems+='<div class="template-item" data-id="'+data.files[i].id+'">'+
                                       '<div class="template-item-icon">'+
                                         '<i class="fa fa-file-text-o"></i>'+
                                       '</div>'+
                                       '<div class="template-item-name">'+
                                         data.files[i].name+
                                       '</div>'+
                                   '</div>';
            }
            $('.template-list').html(_templateItems);
          }
        else if (data.code==1) {
              $('.template-list').html('<div style="text-align:center">No items</div>');
          }
      },
      error: function() {}
  });
}
$(document).on('click', '.btn-save-template', function() {
    $('.input-error').text('');
    if ($('.template-name').val().length < 1) {
        $('.input-error').text('Template name required');
        return false;
    }
    $.ajax({
        url: 'save_template.php',
        type: 'POST',
        //dataType: 'json',
        data: {
            name: $('.template-name').val(),
            content: $('.bal-content-wrapper').html()
        },
        success: function(data) {
        //  console.log(data);
            if (data=== 'ok') {
                $('#popup_save_template').modal('hide');
            } else {
              $('.input-error').text('Problem in server');
            }
        },
        error: function(error) {
            $('.input-error').text('Internal error');
        }
    });
});
$(document).on('click', '.template-list .template-item', function() {
    $('.template-list .template-item').removeClass('active');
    $(this).addClass('active');
    $('.btn-load-template').show();
});
$(document).on('click', '.btn-load-template', function() {
  _dataId=$('.template-list .template-item.active').attr('data-id');
  //search template in array
  var result = $.grep(_templateListItems, function(e){
    return e.id == _dataId;
  });
  if (result.length == 0) {
    //show error
    $('.template-load-error').text('An error has occurred');
  }
    _contentText = $('<div/>').html(result[0].content).text();
    $('.bal-content-wrapper').html(_contentText);
    $('#popup_load_template').modal('hide');
    makeSortable();
});


$(document).on('keyup', '.email-width', function() {
    _element = $(this);
    _val=$('.email-width').val();
    if (parseInt(_val)<300 ||  parseInt(_val)>1000 ) {
      return false;
    }
    $('.bal-content-main').css('width',_val+'px');
});
$(document).on('click', '.btn-save-editor', function() {
  $('.sortable-row.code-editor .sortable-row-content').html(_aceEditor.getSession().getValue());
  $('#popup_editor').modal('hide');
  $('.sortable-row.code-editor').removeClass('code-editor');
});
