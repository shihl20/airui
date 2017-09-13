// Author:石红军
// Create Date:2014-11-07

var htmlHelper = {};
(function () {
    // 创建table标签
    function table() {
        var html = $('<table>');
        var thead = $('<thead>');
        var tbody = $('<tbody>');
        var isCreateHead = true;
        //var isCreateRow = false;
        var isCreateRow = true;
        var headCount = 0;
        var hideColIndex = 0;
        var rowCount = 0;
        var selectable = false;

        // 设置隐藏列,最先调用,在clear方法后就调用
        this.setHideCol = function (colIndexArray) {
            hideColIndex = colIndexArray;
        };

        this.setMarginCol = function (bool, colIndex) {

        };

        // 创建表格头部,传入表头数组,注意需要传入数组
        this.addHeads = function (headArray) {
            headCount = headArray.length;
            // 循环构造表头列
            for (var index = 0; index < headCount; index++) {
                var str = $(String.format('<th>{0}</th>', headArray[index]));

                if (this.isHideCol(index)) {
                    str.addClass('hide');
                }
                thead.append(str);
            }

            isCreateHead = true;
        };
        //添加复杂表头（行列合并），在headString中定义好，传入，columns表示table的列数；
        this.addTableHeader = function (headString, columns) {
            headCount = columns;
            thead.append($(headString));
            thead.addClass('common-table-tbody');
            isCreateHead = true;
        };
        // 创建表格行,传入每列的值数组,注意需要传入数组
        this.addRow = function (colArray) {
            //if (colArray.length != headCount) {
            //    global.exceptionHandler("表头个数与数据列个数不一致,无法创建表格!");
            //    return;
            //}
            rowCount++;

            var row = $('<tr>');
            // 设置表格奇偶行样式
            if (rowCount % 2 == 0) {
                row.addClass('common-table-row-even');
            }

            tbody.append(row);

            // 循环构造列
            for (var index = 0; index < headCount; index++) {
                var value = colArray[index] == null ? "" : colArray[index];
                var cell = $(String.format('<td>{0}</td>', value));
                // 判断是否是隐藏列
                if (this.isHideCol(index)) {
                    cell.addClass('hide');
                }
                // 判断是否是可选样式列
                if (selectable && index == headCount - 1) {
                    cell.addClass('common-table-row-selectable');
                }

                row.append(cell);
            };

            isCreateRow = true;
        };
        //给现有表格表格，构造行
        this.createRow = function (colArray) {

            var row = $('<tr>');
            for (var index = 0; index < colArray.length; index++) {
                var value = colArray[index] == null ? "" : colArray[index];
                var cell = $(String.format('<td>{0}</td>', value));
                // 判断是否是隐藏列
                if (this.isHideCol(index)) {
                    cell.addClass('hide');
                }

                // 判断是否是可选样式列
                if (selectable && index == colArray.length - 1) {
                    cell.addClass('common-table-row-selectable');
                }
                row.append(cell);
            }

            return row;
        };

        // 返回表格对象
        this.get = function () {
            if (!isCreateHead) {
                global.exceptionHandler("请先创建表头!");
                return null;
            }

            if (!isCreateRow) {
                global.exceptionHandler("请先创建表列!");
                return null;
            }

            html.addClass('common-table');
            html.append(thead);
            html.append(tbody);
            return html;
        };

        // 设置是否显示可选择行
        this.selectableStyle = function (bool) {
            selectable = bool;
        };
        // 判断是否是需要隐藏的列
        this.isHideCol = function (index) {
            for (i in hideColIndex) {
                if (i == index) {
                    return true;
                }
            }
            return false;
        };

        // 清空数据,在使用之前调用,否则会有重复数据
        this.clear = function () {
            html = $('<table>');
            thead = $('<thead>');
            tbody = $('<tbody>');
            isCreateHead = true;
            isCreateRow = true;
            headCount = 0;
            hideColIndex = 0;
            rowCount = 0;
            selectable = false;
        };
    };

    // 创建ul标签
    function ul() {
        var html = $('<ul>');
        // 清空数据,在使用之前调用,否则会有重复数据
        this.clear = function () {
            html = $('<ul>');
        };

        this.addItem = function (title, value, isHide) {
            value = (value == null) ? "" : value;

            var li = $(String.format(
                '<li><h1>{0}</h1>' +
                    '<label>{1}</label>' +
                    '<div class="clear"></div>' +
                    '</li>',
                title, value));

            if (isHide) {
                li.addClass('hide');
            }

            html.append(li);
        };

        this.get = function () {
            html.addClass('common-ul');
            return html;
        };
    }

    // 创建listview控件
    function listView() {
        var control = $('<ul data-gd-listview="1">');
        this.clear = function () {
            control = $('<ul data-gd-listview="1">');
        };
        this.addItem = function (title, content) {
            var li = $(String.format(
                '<li>' +
                '<label>{0}</label>' +
                '<div></div>' +
                '</li>', title));

            li.children('div').html(content);
            control.append(li);
        };
        this.get = function () {
            return control;
        };
    }
    // 创建tab控件
    function tab() {
        var control = $('<ul data-gd-tab="1">');
        this.clear = function () {
            control = $('<ul data-gd-tab="1">');
        };

        this.addItem = function (title, content, isSelected) {
            var li = $(String.format('<li>' +
                    '<label title="{0}">{0}</label>' +
                    '<div></div>' +
                    '</li>', title));

            if (isSelected) {
                li.attr('data-gd-tab-selected', true);
            }

            li.children('div').html(content);
            control.append(li);
        };

        this.get = function () {
            return control;
        };
    }
    // 多选select控件
    function multiSelect() {
        var base = new select('<select data-gd-multiSelect="1">');

        this.init = function () {
            base.init();
        };

        this.clear = function () {
            base.clear();
        };

        this.addDefaultText = function (text) {
            base.addDefaultText(text);
        };

        this.addItem = function (id, content, isSelected) {
            base.addItem(id, content, isSelected);
        };
        this.get = function () {
            return base.get();
        };
    }
    // 单选select控件
    function singleSelect() {
        var base = new select('<select data-gd-singleSelect="1">');

        this.init = function () {
            base.init();
        };

        this.clear = function () {
            base.clear();
        };
        this.addId = function (id) {
            base.addId(id);
        };
        this.addDefaultText = function (text) {
            base.addDefaultText(text);
        };

        this.addItem = function (id, content, isSelected) {
            base.addItem(id, content, isSelected);
        };
        this.get = function () {
            return base.get();
        };
    }
    // 选择控件父类
    function select(control) {
        var controlCopy = control;
        this.init = function () {
            control = controlCopy;
            control = $(control);
        };
        this.clear = function () {
            this.init();
        };
        this.addId = function (id) {
            control.attr('id', id);
        };
        this.addDefaultText = function (text) {
            control.attr('data-gd-select-defaultText', text);
        };
        this.addItem = function (id, content, isSelected) {
            var option = $(String.format('<option value={0}></option>', id));
            if (isSelected) {
                option.attr('selected', 'selected');
            }
            option.html(content);
            control.append(option);
        };
        this.get = function () {
            return control;
        };
    }
    // 网签部分，ul-li-item构建类
    //Sheme
    function listItem() {
        var html = $('<ul data-gd-ul-item="1">');
        //房屋价格

        var itemModel = '<li class="ul-li-item"><div class="ui-grid-a"><div class="ui-block-a colspan"><div class="ui-body ui-body-d"><span class="span-blue"><strong>{2}({0})</strong></span></div></div><div class="ui-block-a colspan"><div>售价:<span class="span-red">{1}</span></div></div><div class="ui-block-a"><div>套内:<span class="span-green">{3}</span>㎡</div></div><div class="ui-block-b"><div>建面:<span class="span-green">{4}</span>㎡</div></div></div></li>';

        //房屋价格对比
        var itemUpdated = '<li class="ul-li-item"><div class="ui-grid-a"><div class="ui-block-a colspan"><div class="ui-body ui-body-d"><span class="span-blue"><strong>{2}({0})</strong></span></div></div><div class="ui-block-a colspan"><div>现售价:<span class="span-red">{1}</span></div></div><div class="ui-block-a"><div>原售价:<span class="span-red">{3}</span></div></div><div class="ui-block-a"><div>套内:<span class="span-green">{4}</span>㎡</div></div><div class="ui-block-b"><div>建面:<span class="span-green">{5}</span>㎡</div></div></div></li>';
        //统计模板
        var itemCount = '<li class="ul-li-item"><p class="title"><strong>{0}（共{1}套，面积{2}㎡）</strong></p><span>申请<strong class="span-red">{3}</strong>套（住宅<span class="span-red">{4}</span>套，商业<span class="span-red">{5}</span>，其他<span class="span-red">{6}</span>套）</span><br/><span>面积<strong class="span-red">{7}</strong>㎡（住宅<span class="span-red">{8}</span>㎡，商业<span class="span-red">{9}</span>㎡，其他<span class="span-red">{10}</span>㎡）</span></li>'
        // 清空数据,在使用之前调用,否则会有重复数据
        this.clear = function () {
            html = $('<ul data-gd-ul-item="1">');
        };
        //构建房屋价格Html
        this.addItem = function (houseNo, price, floorName, innerArea, buildArea) {
            var li = String.format(itemModel, houseNo, price, floorName, innerArea, buildArea);
            html.append(li);
        };
        //构建房屋价格对比Html
        this.addUpdatedItem = function (houseNo, price, oldPrice, floorName, innerArea, buildArea) {
            var li = String.format(itemUpdated, houseNo, price, floorName, oldPrice, innerArea, buildArea);
            html.append(li);
        }

        //构建统计Item Html
        this.addCountItem = function (floorname, allcount, allarea, applyallcount, applyallarea, housecount, housearea, bizcount, bizarea, othercount, otherarea) {
            var li = String.format(itemCount, floorname, allcount, allarea, applyallcount, housecount, bizcount, othercount, applyallarea, housearea, bizarea, otherarea);
            html.append(li);
        }

        this.get = function () {
            html.addClass('ul-item');
            return html;
        };
    };
    //Permit
    function permitItem() {
        var html = $('<ul data-gd-ul-item="1">');
        var itemModel = '<li class="ul-li-item"><div class="ui-grid-a"><div class="ui-block-a colspan"><div class="ui-body ui-body-d"><span class="span-blue"><strong>{0}({1})</strong></span></div></div><div class="ui-block-a"><div>套内:<span class="span-green">{2}</span>㎡</div></div><div class="ui-block-b"><div>建面:<span class="span-green">{3}</span>㎡</div></div></div></li>';
        // 清空数据,在使用之前调用,否则会有重复数据
        this.clear = function () {
            html = $('<ul data-gd-ul-item="1">');
        };
        //返回值
        this.get = function () {
            html.addClass('ul-item');
            return html;
        };
        this.addItem = function (floorName, houseNo, innerArea, buildArea) {
            var li = String.format(itemModel, floorName, houseNo, innerArea, buildArea);
            html.append(li);
        }
    };

    function recipientItem() {
        var html = $('<ul data-gd-ul-item="1">');
        var model = '<li><div class="leftdiv">{0}{1}（{2}）</div><div class="rightdiv">{3}份{4}页</div></li>'
        //清空数据列表
        this.clear = function () {
            html = $('<ul data-gd-ul-item="1">');
            html.append('<li style="line-height: 20px;"><div class="ui-grid-a "><div class="ui-block-a colspan"><div class="ui-body ui-body-d"><span class="span-red"><strong>图例:</strong><span style="padding: 3px 8px;background-color: #95D4E9; color:#000">已收取</span></span></div></div></div></li>');
        };
        //获取构建的列表
        this.get = function () {
            html.addClass('ul-important');
            return html;
        };
        //添加要件项
        this.addItem = function (impDocName, paperType, gatherMode, scores, pages, isChecked) {
            var li = $(String.format(model, impDocName, paperType, gatherMode, scores, pages));
            if (isChecked) {
                li.addClass('isChecked');
            }
            html.append(li);
        };
    };
    //详情
    function detailsItem() {
        var htmlModel = '<div><label class="content-label"><span class="span-abs">{0}</span><p class="drak marginLeft">{1}</p></label></div>';
        var html = $('<div data-gd-details="1">');
        this.clear = function () { html = $('<div data-gd-details="1">'); };
        this.addItem = function (key, val, unit, isBottomBoder, fontSize) {
            unit = unit == null ? "" : unit;
            var item = $(String.format(htmlModel, key, (val == null ? "" : val + unit)));
            if (val == "" || val == null) {
                item.children('label').children('p.marginLeft').css('height', '18px');
            }
            if (isBottomBoder) {
                item.addClass("border-bottom");
            }
            fontSize = fontSize == null ? 14 : fontSize;
            fontSize = fontSize * key.length;
            item.children().children('p').css('padding-left', fontSize + 'px');
            if (key == '' || key == null) {
                item.children().children('p').css('padding-top', '.4em');
            }
            html.append(item);
        };
        this.get = function () {
            return html.html();
        };
    };

    htmlHelper.table = new table();
    htmlHelper.ul = new ul();
    htmlHelper.listView = new listView();
    htmlHelper.tab = new tab();
    htmlHelper.multiSelect = new multiSelect();
    htmlHelper.singleSelect = new singleSelect();
    htmlHelper.listItem = new listItem();
    htmlHelper.permitItem = new permitItem();
    htmlHelper.recipientItem = new recipientItem();
    htmlHelper.detailsItem = new detailsItem();


    /*author:石红军
    **createTime:2014-11-12
    **通用Html辅助类
    */

    /*通用2*2+1选择框或后箭头列表展示层
    参数说明：参数1：整层点击事件
              参数2：第1列第1行数据
              参数3：第1列第2行数据
              参数4：第2列第1行数据
              参数5：第2列第2行数据
              参数6：显示箭头还是选择框 1 箭头 2选择框
              参数7：箭头图标
            */
    function contentDiv() {
        var html = $('<div>');
        var listContent;
        //添加行
        this.addRow = function (pramArray) {
            var listContentLeft = $('<div>'),
            listContentLeftUp = $('<div>'),
            listContentLeftDown = $('<div>'),
            listContentRight = $('<div>'),
            listContentRightUp = $('<div>'),
            listContentRightDown = $('<div>'),
            listContentArrow = $('<div>'),
            listContentSelect = $('<div>');
            listContent = $('<div class="listContent">')
            listContent.attr('data-click', pramArray[0]);
            listContent.attr('data-instance', pramArray[5]);

            listContentLeft.addClass('listContentLeft');
            listContentLeftUp.append(String.format('<div class="listFontSize-1" title={0}>{0}</div>', pramArray[1]));
            listContentLeftDown.append(String.format('<div>{0}</div>', pramArray[2]));
            listContentLeft.append(listContentLeftUp);
            listContentLeft.append(listContentLeftDown);

            listContentRight.addClass('listContentRight');
            listContentRightUp.append(String.format('<div>{0}</div>', pramArray[3]));
            listContentRightDown.append(String.format('<div>{0}</div>', pramArray[4]));
            listContentRight.append(listContentRightUp);
            listContentRight.append(listContentRightDown);

            listContentArrow.addClass('listContentArrow');
            if (pramArray[7] != undefined && pramArray[7] != null && pramArray[7] != '') {
                listContentArrow.append('<img src="{0}" />', pramArray[7]);
            }
            else {
                listContentArrow.append('<img src="Images/listArrow.png" />');
            }

            listContentSelect.addClass('listContentSelect');
            listContentSelect.append('<input name="checkBiz" type="checkbox" data-role="none" data-id="{0}" class="listContent-checkbox" />');

            if (pramArray[6] != undefined && pramArray[6] != null && pramArray[6] != '') {
                switch (pramArray[6]) {
                    case '1':
                        listContentSelect.css("display", "block")
                        listContentArrow.css("display", "none")
                        break;
                    default:
                        break;
                }
            }

            listContent.append(listContentLeft);
            listContent.append(listContentRight);
            listContent.append(listContentArrow);
            listContent.append(listContentSelect);
            listContent.append('<div style="clear:both"></div>');
            html.append(listContent);
        };
        //清空数据
        this.clear = function () {
            html = $('<div>');
        }
        //获取列表数据
        this.get = function () {
            return html.html();
        }
    }

    /*通用1*3+1选择框或后箭头列表展示层
   参数说明：参数1：整层点击事件
             参数2：第1行数据
             参数3：第2行数据
             参数4：第3行数据
             参数5：箭头图标
           */
    function contentDiv131() {
        var html = $('<div>');
        var listContent;
        //添加行
        this.addRow = function (pramArray) {
            var listContentLeft = $('<div>'),
            listContentLeft = $('<div>'),
            listContentArrow = $('<div>'),
            listContentSelect = $('<div>');
            listContent = $(String.format('<div class="listContent131" data-click="{0}">', pramArray[0]));
            contentDiv = $('<div >');

            listContentLeft.addClass('Left');
            listContentLeft.append(String.format('<div class="FontSize-1">{0}</div>', pramArray[1]));
            listContentLeft.append(String.format('<div class="FontSize-2">{0}</div>', pramArray[2]));
            listContentLeft.append(String.format('<div class="FontSize-3">{0}</div>', pramArray[3]));

            listContentArrow.addClass('listContentArrow');
            if (pramArray[4] != undefined && pramArray[4] != null && pramArray[4] != '') {
                listContentArrow.append('<img src="{0}" />', pramArray[4]);
            }
            else {
                listContentArrow.append('<img src="Images/listArrow.png" />');
            }

            listContentSelect.addClass('listContentSelect');
            listContentSelect.append('<input name="" type="checkbox" class="listContent-checkbox" />');

            contentDiv.append(listContentLeft);
            contentDiv.append(listContentArrow);
            listContent.append(contentDiv);
            listContent.append(listContentSelect);
            html.append(listContent);
        };
        //清空数据
        this.clear = function () {
            html = $('<div>');
        }
        //获取列表数据
        this.get = function () {
            return html;
        }
    }

    /*通用1*2 
    */
    function row1x2() {
        //添加行
        /*pram参数数组：参数1：左边内容
                        参数2：右边内容
                        参数3：fixedLength 用于指定标题缺省长度（如：指定缺省长度为4，则2个字的标题的DIV长度为4个字的长度）
        */
        this.addRow = function (pram, fixedLength) {
            var rowDiv = $('<div>')
            rowDiv.addClass('row1x2');
            if (fixedLength == undefined) {
                fixedLength = 5;
                if (pram[0].replace(new RegExp(/( )/g), '').length <= fixedLength && pram[0].length > 0) {
                    var titleLength = fixedLength * htmlHelper.sizeHelp.wordLenth();
                }
                else {
                    var titleLength = pram[0].length * htmlHelper.sizeHelp.wordLenth();
                }
            }
            else {
                titleLength = fixedLength * htmlHelper.sizeHelp.wordLenth();
            }
            var title = pram[0].replace(new RegExp(/( )/g), '<span class="hidSpan">1</span>').replace(new RegExp(/(1<\/span>1<span class="hidSpan">)/g), '1');
            rowDiv.append(String.format('<span  style="width:{2}px" class="left" >{0}</span><span style="width:{3}px" class="right" >{1}</span>', title, pram[1], titleLength, (htmlHelper.sizeHelp.screenWidth() - titleLength - 20)));
            return rowDiv;
        }
    }

    /*通用1*2*2  一行平分为两列，两列又各自有标题和内容 
    pram参数二维数组：
                        参数1：第一列标题1
                        参数2：第二列内容1                        
                        参数3：fixedLength 用于指定标题宽度（如：指定缺省长度为4，则2个字的标题的DIV长度为4个字的长度）
                        参数4：第三列标题2
                        参数5：第四列内容2
                        eg:[['标题1','内容1','标题1字符数'],['标题2','内容2','标题2字符数'],...]
    */
    function addRow1x2x2(pram) {
        fixedLength = 5;
        var rowDiv = $('<div>')
        rowDiv.addClass('row1x2');
        var colNum = pram.length;
        var perColWidth = Math.floor((htmlHelper.sizeHelp.screenWidth() - 20) / colNum);
        for (var i = 0; i < colNum; i++) {
            var titleLength = 0;
            if (pram[i][2] == undefined) {
                if (pram[i][0].replace(new RegExp(/( )/g), '').length <= fixedLength && pram[i][0].length > 0) {
                    titleLength = fixedLength * htmlHelper.sizeHelp.wordLenth();
                }
                else {
                    titleLength = pram[i][0].length * htmlHelper.sizeHelp.wordLenth();
                }
            }
            else {
                titleLength = pram[i][2] * htmlHelper.sizeHelp.wordLenth();
            }
            var title = pram[i][0].replace(new RegExp(/( )/g), '<span class="hidSpan">1</span>').replace(new RegExp(/(1<\/span>1<span class="hidSpan">)/g), '1');
            rowDiv.append(String.format('<span  style="width:{2}px" class="left" >{0}</span><span style="width:{3}px;text-align:left;min-height:{4}px;float:left" class="right" >{1}</span>', title, pram[i][1], titleLength, (perColWidth - titleLength), htmlHelper.sizeHelp.wordHeight()));
        }
        return rowDiv;
    }

    //页脚导航栏
    //图标位置iconPosition
    function foot() {
        var navArray = new Array();
        var navBar = $('<div class="weui-tabbar">');
        var bar = $('<a  class="weui-tabbar__item weui-bar__item--on">');
        //添加导航栏
        /*pram参数数组：1'导航地址或js函数(javascript:())'
                        2'图标(名称,自定义图标请在Themes.css中添加样式如：todo)',
                        3'文字说明']
                        4'图标是否在左边，不传则在上面'
                        */
        this.addNavBar = function (pramArray) {
            navArray.push([String.format('</span><div class="weui-tabbar__icon"><img src="Images/un_{0}" /></div><p style="margin:0px;color:#808080" class="weui-tabbar__label">{2}</p>', pramArray[1], pramArray[3] == 'left' ? '' : '<br>', pramArray[2]), pramArray[0], pramArray[3]]);
        }
        //curNavBar当前选中
        this.get = function (curNavBar) {
            var j = navArray.length;
            var barWidth = 99 / j;
            for (var i = 0; i < j; i++) {
                bar = $('<a  class="weui-tabbar__item">');
                if (i + 1 == curNavBar) {
                    bar = $('<a  class="weui-tabbar__item weui-bar__item--on">');
                    //选中字体色改变
                    bar.css("color", "#2B9FF0");
                    //选中换图标
                    navArray[i][0] = navArray[i][0].replace('Images/un_', 'Images/');                    
                    navArray[i][0] = navArray[i][0].replace('color:#808080', 'color:#2B9FF0');
                }
                //bar.css('width', barWidth + '%');
                //bar.css('height', '45px');
                //if (navArray[i][2] == 'left') {
                //    bar.css('line-height', '45px');
                //}
                bar.attr('data-link', navArray[i][1])
                bar.append(navArray[i][0]);
                if (i != 0) {
                    //bar.css('border-left', '1px solid #bababa');
                }
                navBar.append(bar);
            }
            //navBar.append('<div style="clear:both">');
            return navBar;
        }
        this.clear = function () {
            navArray = new Array();
            navBar = $('<div class="weui-tabbar">');
        }
    }

    //各种尺寸辅助类
    function sizeHelp() {
        //屏幕宽度

        //单个字符宽度
        var singWordLenth = null;
        var singWordHeight = null;
        var timeLenth = null;
        this.setLenth = function () {
            $('body').append('<span id="wordWidth" style="display:none">字</span>');
            $('body').append('<span id="timeWidth" class="hidSpan">1900-01-010</span>');
            singWordLenth = $('#wordWidth').width();
            singWordHeight = $('#wordWidth').height();
            timeLenth = $('#timeWidth').width();
        }
        //单一字符宽度
        this.wordLenth = function () {
            return singWordLenth;
        }
        //单一字符高度
        this.wordHeight = function () {
            return singWordHeight;
        }
        //时间格式尺寸
        this.timeLenth = function () {
            return timeLenth;
        }
        //屏幕宽度
        this.screenWidth = function () {
            return $(document.body).width();
        }
        //屏幕高度
        this.screenHeight = function () {
            return $(document.body).height();
        }
    }

    /*概要信息*/
    function baseInfo() {
        //清除浮动信息层
        var floatClear = $('<div class="floatClear">');
        //概要信息
        var baseInfoGroup = $('<div id="baseInfo" class="baseInfo">');
        //基础信息
        var baseInfo = $('<div class="base">');
        //主要信息
        var mainInfo = $('<div class="mainInfo" style="border-bottom:0px">');
        //描述信息
        var discription = $('<div class="discription">');
        //设置基础信息 参数 1：业务宗号 2：业务小类 3：时限类别 4：受理人 5：受理时间
        this.setBaseInfo = function (baseArray) {
            //时限类别
            var timeLimtHtml = '';
            switch (baseArray[2]) {
                case '紧急':
                    timeLimtHtml = String.format('<span style="color:red">[{0}]</span>', '急件')
                    break
                case '快速':
                    timeLimtHtml = String.format('<span style="color:orange">[{0}]</span>', '快件')
                    break
                default:
                    break
            }
            //alert(htmlHelper.sizeHelp.wordLenth());
            baseInfo.append(String.format(
                    '<div style="height: 48px; position: relative;">'
                           + '<div style="float: left; width:{0}px; position: absolute; bottom: 0px;"><div >{1}{3}</div><div style="color:#999999">登记原因：<font color="black">{2}</font></div></div>'
                           + '<div style="float: right;width:48px" id="erecord"><img src="Images/e-record.png" /></div></div>'
                  + '<div style="clear: both;">'
                           + '<div style="width: {4}px; float: left;color:#999999">受<span class="hidSpan">1</span>理<span class="hidSpan">1</span>人：<font color="black">{5}</font></div>'
                           + '<div style="width: {6}px; float: right; text-align: right; font-family: \'Times New Roman\';">{7}</div><div style="clear: both"></div></div>'
                            , htmlHelper.sizeHelp.screenWidth() - 48 - 20, baseArray[0], baseArray[1], timeLimtHtml, htmlHelper.sizeHelp.screenWidth() - htmlHelper.sizeHelp.timeLenth() - 20, baseArray[3], htmlHelper.sizeHelp.timeLenth(), baseArray[4]));
        };
        //设置主要信息 mainInfoArray1:字段名 2：字段值 borderExist:是否有底边框 titleLength 标题长度
        this.setMainInfo = function (mainInfoArray, borderExist, titleLength) {
            if (borderExist == false) {
                mainInfo.attr('style', 'border-bottom:0px');
            }
            mainInfo.append(htmlHelper.row1x2.addRow(mainInfoArray, titleLength));
        };
        //设置描述信息
        this.setDiscription = function (disHtml) {
            discription.append(disHtml);
        };

        //获取组装好的概要信息
        this.get = function () {
            mainInfo.append('<div style="clear:both"></div>');
            baseInfoGroup.append(baseInfo);
            baseInfoGroup.append(mainInfo);
            baseInfoGroup.append(discription);
            return baseInfoGroup;
        };
        //清理概要信息
        this.clear = function () {
            //基础信息
            baseInfo = $('<div class="base">');
            //主要信息
            mainInfo = $('<div class="mainInfo" >');
            //描述信息
            discription = $('<div class="discription">');
            baseInfoGroup = $('<div id="baseInfo" class="baseInfo">');
        };
    }

    /*详细信息块*/
    function detailBlock() {
        var blockHtml = $('<div class="detailBlock">');
        /*参数说明：infoArray 1：字段名 2：内容
                    borderExist:是否有底框
                    fixedLength:标题缺省长度（不指定时按照4个字+1个冒号计算 如：指定缺省长度为4，则2个字的标题的DIV长度为4个字的长度）
        */
        this.set = function (infoArray, fixedLength) {
            blockHtml.append(htmlHelper.row1x2.addRow(infoArray, fixedLength));
        };
        /**一行两列均分
         pram参数二维数组：
                        参数1：第一列标题1
                        参数2：第二列内容1                        
                        参数3：fixedLength 用于指定标题宽度（如：指定缺省长度为4，则2个字的标题的DIV长度为4个字的长度）
                        参数4：第三列标题2
                        参数5：第四列内容2
                        eg:[['标题1','内容1','标题1字符数'],['标题2','内容2','标题2字符数'],...]
        */
        this.set2 = function (infoArray) {
            blockHtml.append(addRow1x2x2(infoArray));
        }
        this.get = function () {
            var resultHtml = $('<div>');
            $(blockHtml).append('<div style="clear:both"></div>');
            $(resultHtml).append(blockHtml);
            return resultHtml;
        };
        //添加顶边
        this.addBorderTop = function () {
            blockHtml.attr('style', 'border-top:1px;');
        };
        //清除底边
        this.clearBorderBottom = function () {
            blockHtml.attr('style', 'border-bottom:0px;');
        };
        //虚线底边
        this.dashedBorderBottom = function () {
            blockHtml.attr('style', 'border-bottom:1px dashed #999999;');
        };
        this.clear = function () {
            blockHtml = $('<div class="detailBlock">');
        };
    }

    /*折叠块*/
    function foldBlock() {
        /* 参数说明：
               参数1：块ID
               参数2：块标题
               参数3：块内容（自定义）
               参数4：默认开启还是关闭
        */
        this.get = function (contentArray) {
            if (contentArray[3] == 'open') {
                var html = $('<div class="open">');//默认展开
            }
            else {
                var html = $('<div class="closed">');//默认关闭
            }

            html.attr('id', contentArray[0]);
            html.append(String.format('<div class="head"><div class="img"></div><div class="title">{0}</div><div style="clear: both;"></div></div>'
                + '<div class="content">{1}<div style="clear: both;"></div></div>', contentArray[1], contentArray[2]));
            return html;
        }
    }

    /*标签类容块*/
    function tabContent() {
        /*参数说明：
              contentArray：类容块二维数组，数组的一个元素（一维数组）表示一块内容的标题及HTML代码
              blockId:父容器ID
              fixedContent:默认显示类容（用1,2,3...表示，取对应数组元素）
        */
        this.get = function (contentArray, blockId, fixedContent) {
            var tabHtml = $('<div class="contentTab">');
            var contentHtml = $('<div>');
            var resultHmtl = $('<div>');
            if (contentArray != undefined && contentArray != null && contentArray.length > 0) {
                var tabWidth = 100 / contentArray.length;
                //生成标签
                for (var i = 0, j = contentArray.length; i < j; i++) {
                    tabHtml.append(String.format('<div data-content-id="{0}" class="{1}" style="width:{2}">{3}</div>', blockId + i, (i == fixedContent - 1) ? 'selected' : 'unSelected', tabWidth + '%', contentArray[i][0]));
                }
                resultHmtl.append(tabHtml);
                //生成内容
                for (var i = 0, j = contentArray.length; i < j; i++) {
                    contentHtml.append(String.format('<div id="{0}" class="tabContent">{1}</div>', blockId + i, contentArray[i][1]));
                }
                resultHmtl.append(contentHtml);
            }
            return $(resultHmtl).html();
        }
    }

    /*页码内容块*/
    function pageContent() {
        //屏幕页码标签最大数
        var maxPage = 5;
        /*参数说明：
              contentArray：类容块二维数组，数组的一个元素（一维数组）表示一块内容的标题及HTML代码
              blockId:父容器ID
              fixedContent:默认显示类容（用1,2,3...表示，取对应数组元素）
        */
        this.get = function (contentArray, blockId, fixedContent) {
            var pageWrapper = $(String.format('<div id="{0}" class="pageWrapper">', blockId + 'PageWrapper'));
            var pageScroll = $(String.format('<div id="{0}" class="pageScroll">', blockId + 'PageScroll'));
            var contentWrapper = $(String.format('<div id="{0}" class="contentWrapper">', blockId + 'ContentWrapper'));
            var contentScroll = $(String.format('<div id="{0}" class="contentScroll">', blockId + 'ContentScroll'));
            var resultHmtl = $('<div>');
            if (contentArray != undefined && contentArray != null && contentArray.length > 0) {
                var tabWidth = (window.innerWidth - 20) / maxPage; //contentArray.length > 5 ? 20 : 100 / contentArray.length;
                //生成标签
                $(pageScroll).css('width', String.format('{0}px', tabWidth * contentArray.length));
                for (var i = 0, j = contentArray.length; i < j; i++) {
                    pageScroll.append(String.format('<div id="{0}" data-content-index="{1}" data-scrollId ="{5}" class="{2}" style="width:{3}">{4}</div>', blockId + i + "Tab", i, (i == fixedContent - 1) ? 'selected' : 'unSelected', tabWidth + 'px', contentArray[i][0], blockId + 'ContentScroll'));
                }
                pageWrapper.append(pageScroll)
                //生成内容
                $(contentScroll).css('width', String.format('{0}px', (window.innerWidth - 20) * contentArray.length));
                for (var i = 0, j = contentArray.length; i < j; i++) {
                    contentScroll.append(String.format('<div id="{0}" data-tab-id="{1}" class="scrollContent" style="width:{2}px">{3}</div>', blockId + i, blockId + i + "Tab", window.innerWidth - 20, contentArray[i][1]));
                }
                contentWrapper.append(contentScroll);
                resultHmtl.append(pageWrapper);
                resultHmtl.append(contentWrapper);
            }
            return $(resultHmtl).html();
        }
    }

    htmlHelper.contentDiv = new contentDiv();
    htmlHelper.contentDiv131 = new contentDiv131();
    htmlHelper.row1x2 = new row1x2();
    htmlHelper.foot = new foot();
    htmlHelper.sizeHelp = new sizeHelp();
    htmlHelper.baseInfo = new baseInfo();
    htmlHelper.detailBlock = new detailBlock();
    htmlHelper.foldBlock = new foldBlock();
    htmlHelper.tabContent = new tabContent();
    htmlHelper.pageContent = new pageContent();
})();