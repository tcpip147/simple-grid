var SimpleGrid = function (option) {
    var frame = new SimpleFrame();
    var table = new SimpleTable();

    var colModel = [];
    for (var i = 0; i < 20; i++) {
        colModel.push({
            title: "HEAD_" + i,
            dataKey: "COL_" + i,
            width: 100 + 3 * i
        });
    }

    var data = [];
    for (var i = 0; i < 50; i++) {
        data.push({});
        for (var j = 0; j < 20; j++) {
            data[i]["COL_" + j] = i + " " + j;
        }
    }

    table.setColModel(colModel);
    table.setData(data);
    table.init();

    function SimpleFrame() {
        var frame = this;

        frame.eContainer;
        frame.verticalScroll;
        frame.horizontalScroll;

        frame.scrollWidth = 14;
        frame.cursorSizeMinimum = 50;

        frame.contentWidth;
        frame.contentHeight;

        frame.subscribers = [];

        makeContainer();
        makeScrollbar();
        addEventListener();

        SimpleFrame.prototype.setContentWidth = setContentWidth;
        SimpleFrame.prototype.setContentHeight = setContentHeight;
        SimpleFrame.prototype.addSubscriber = addSubscriber;

        function makeContainer() {
            frame.eContainer = document.getElementById(option.id);
            frame.eContainer.classList.add("simple-grid-frame-container");
            frame.eContainer.style.position = "relative";
            frame.eContainer.style.userSelect = "none";
            frame.eContainer.style.overflow = "hidden";
            frame.eContainer.style.width = option.width + "px";
            frame.eContainer.style.height = option.height + "px";
            frame.eContainer.style.outlineWidth = 1 + "px";
        }

        function makeScrollbar() {
            frame.verticalScroll = createScrollbar("vertical");
            frame.horizontalScroll = createScrollbar("horizontal");
            resizeScrollbar();

            function createScrollbar() {
                var eContainer = document.createElement("div");
                eContainer.classList.add("simple-grid-frame-scroll");
                eContainer.style.position = "absolute";
                eContainer.style.zIndex = 10;
                frame.eContainer.appendChild(eContainer);

                var eButton1Wrapper = document.createElement("div");
                eButton1Wrapper.classList.add("simple-grid-frame-scroll-button1-wrapper");
                eButton1Wrapper.style.position = "absolute";
                eContainer.appendChild(eButton1Wrapper);

                var eButton1 = document.createElement("div");
                eButton1.classList.add("simple-grid-frame-scroll-button1");
                eButton1Wrapper.appendChild(eButton1);

                var eCursorWrapper = document.createElement("div");
                eCursorWrapper.classList.add("simple-grid-frame-scroll-cursor-wrapper");
                eCursorWrapper.style.position = "absolute";
                eContainer.appendChild(eCursorWrapper);

                var eCursor = document.createElement("div");
                eCursor.classList.add("simple-grid-frame-scroll-cursor");
                eCursor.style.position = "absolute";
                eCursor.style.display = "none";
                eCursorWrapper.appendChild(eCursor);

                var eButton2Wrapper = document.createElement("div");
                eButton2Wrapper.classList.add("simple-grid-frame-scroll-button2-wrapper");
                eButton2Wrapper.style.position = "absolute";
                eContainer.appendChild(eButton2Wrapper);

                var eButton2 = document.createElement("div");
                eButton2.classList.add("simple-grid-frame-scroll-button2");
                eButton2Wrapper.appendChild(eButton2);

                return {
                    eContainer: eContainer,
                    eButton1Wrapper: eButton1Wrapper,
                    eButton1: eButton1,
                    eCursorWrapper: eCursorWrapper,
                    eCursor: eCursor,
                    eButton2Wrapper: eButton2Wrapper,
                    eButton2: eButton2,
                    position: 0
                }
            }
        }

        function resizeScrollbar() {
            frame.verticalScroll.eContainer.style.width = frame.scrollWidth + "px";
            frame.verticalScroll.eContainer.style.height = parseInt(frame.eContainer.style.height) - frame.scrollWidth + "px";
            frame.verticalScroll.eContainer.style.left = parseInt(frame.eContainer.style.width) - frame.scrollWidth + "px";

            frame.verticalScroll.eButton1Wrapper.style.width = frame.scrollWidth + "px";
            frame.verticalScroll.eButton1Wrapper.style.height = frame.scrollWidth + "px";

            frame.verticalScroll.eCursorWrapper.style.width = frame.scrollWidth + "px";
            frame.verticalScroll.eCursorWrapper.style.height = parseInt(frame.eContainer.style.height) - 3 * frame.scrollWidth + "px";
            frame.verticalScroll.eCursorWrapper.style.top = frame.scrollWidth + "px";

            frame.verticalScroll.eCursor.style.width = frame.scrollWidth + "px";

            frame.verticalScroll.eButton2Wrapper.style.width = frame.scrollWidth + "px";
            frame.verticalScroll.eButton2Wrapper.style.height = frame.scrollWidth + "px";
            frame.verticalScroll.eButton2Wrapper.style.top = parseInt(frame.eContainer.style.height) - 2 * frame.scrollWidth + "px";

            frame.horizontalScroll.eContainer.style.height = frame.scrollWidth + "px";
            frame.horizontalScroll.eContainer.style.width = parseInt(frame.eContainer.style.width) - frame.scrollWidth + "px";
            frame.horizontalScroll.eContainer.style.top = parseInt(frame.eContainer.style.height) - frame.scrollWidth + "px";

            frame.horizontalScroll.eButton1Wrapper.style.height = frame.scrollWidth + "px";
            frame.horizontalScroll.eButton1Wrapper.style.width = frame.scrollWidth + "px";

            frame.horizontalScroll.eCursorWrapper.style.height = frame.scrollWidth + "px";
            frame.horizontalScroll.eCursorWrapper.style.width = parseInt(frame.eContainer.style.width) - 3 * frame.scrollWidth + "px";
            frame.horizontalScroll.eCursorWrapper.style.left = frame.scrollWidth + "px";

            frame.horizontalScroll.eCursor.style.height = frame.scrollWidth + "px";

            frame.horizontalScroll.eButton2Wrapper.style.height = frame.scrollWidth + "px";
            frame.horizontalScroll.eButton2Wrapper.style.width = frame.scrollWidth + "px";
            frame.horizontalScroll.eButton2Wrapper.style.left = parseInt(frame.eContainer.style.width) - 2 * frame.scrollWidth + "px";
        }

        function addEventListener() {
            var eventInfo = null;

            window.addEventListener("mousedown", function (e) {
                if (e.target == frame.verticalScroll.eButton1Wrapper || e.target == frame.verticalScroll.eButton1) {
                    for (var i = 0; i < frame.subscribers.length; i++) {
                        frame.subscribers[i].onVerticalScrollMoveByUpClick();
                    }
                } else if (e.target == frame.verticalScroll.eCursorWrapper) {
                    if (e.offsetY < frame.verticalScroll.position) {
                        for (var i = 0; i < frame.subscribers.length; i++) {
                            frame.subscribers[i].onVerticalScrollMoveByWrapperUpClick();
                        }
                    } else {
                        for (var i = 0; i < frame.subscribers.length; i++) {
                            frame.subscribers[i].onVerticalScrollMoveByWrapperDownClick();
                        }
                    }
                } else if (e.target == frame.verticalScroll.eCursor) {
                    eventInfo = {
                        name: "MOUSEDOWN_VERTICAL_SCROLL_CURSOR",
                        startY: e.clientY,
                        startCursorPosition: frame.verticalScroll.position,
                        maxCursorPostion: parseInt(frame.verticalScroll.eCursorWrapper.style.height) - parseInt(frame.verticalScroll.eCursor.style.height),
                        needForRAF: true
                    };
                } else if (e.target == frame.verticalScroll.eButton2Wrapper || e.target == frame.verticalScroll.eButton2) {
                    for (var i = 0; i < frame.subscribers.length; i++) {
                        frame.subscribers[i].onVerticalScrollMoveByDownClick();
                    }
                } else if (e.target == frame.horizontalScroll.eButton1Wrapper || e.target == frame.horizontalScroll.eButton1) {
                    for (var i = 0; i < frame.subscribers.length; i++) {
                        frame.subscribers[i].onHorizontalScrollMoveByLeftClick();
                    }
                } else if (e.target == frame.horizontalScroll.eCursorWrapper) {
                    if (e.offsetX < frame.horizontalScroll.position) {
                        for (var i = 0; i < frame.subscribers.length; i++) {
                            frame.subscribers[i].onHorizontalScrollMoveByWrapperLeftClick();
                        }
                    } else {
                        for (var i = 0; i < frame.subscribers.length; i++) {
                            frame.subscribers[i].onHorizontalScrollMoveByWrapperRightClick();
                        }
                    }
                } else if (e.target == frame.horizontalScroll.eCursor) {
                    eventInfo = {
                        name: "MOUSEDOWN_HORIZONTAL_SCROLL_CURSOR",
                        startX: e.clientX,
                        startCursorPosition: frame.horizontalScroll.position,
                        maxCursorPostion: parseInt(frame.horizontalScroll.eCursorWrapper.style.width) - parseInt(frame.horizontalScroll.eCursor.style.width),
                        needForRAF: true
                    };
                } else if (e.target == frame.horizontalScroll.eButton2Wrapper || e.target == frame.horizontalScroll.eButton2) {
                    for (var i = 0; i < frame.subscribers.length; i++) {
                        frame.subscribers[i].onHorizontalScrollMoveByRightClick();
                    }
                }
            });

            window.addEventListener("mousemove", function (e) {
                if (eventInfo != null) {
                    if (eventInfo.needForRAF && eventInfo.name == "MOUSEDOWN_VERTICAL_SCROLL_CURSOR") {
                        eventInfo.needForRAF = false;
                        window.requestAnimationFrame(function () {
                            if (eventInfo != null) {
                                eventInfo.needForRAF = true;
                                var diff = e.clientY - eventInfo.startY;
                                moveVerticalCursor(diff);
                                for (var i = 0; i < frame.subscribers.length; i++) {
                                    frame.subscribers[i].onVerticalScrollMoveByDrag();
                                }
                            }
                        });
                    } else if (eventInfo.needForRAF && eventInfo.name == "MOUSEDOWN_HORIZONTAL_SCROLL_CURSOR") {
                        eventInfo.needForRAF = false;
                        window.requestAnimationFrame(function () {
                            if (eventInfo != null) {
                                eventInfo.needForRAF = true;
                                var diff = e.clientX - eventInfo.startX;
                                moveHorizontalCursor(diff);
                                for (var i = 0; i < frame.subscribers.length; i++) {
                                    frame.subscribers[i].onHorizontalScrollMoveByDrag();
                                }
                            }
                        });
                    }
                }
            });

            window.addEventListener("mouseup", function (e) {
                eventInfo = null;
            });

            function moveVerticalCursor(diff) {
                frame.verticalScroll.position = eventInfo.startCursorPosition + diff;
                if (frame.verticalScroll.position < 0) {
                    frame.verticalScroll.position = 0;
                } else if (frame.verticalScroll.position > eventInfo.maxCursorPostion) {
                    frame.verticalScroll.position = eventInfo.maxCursorPostion;
                }
                frame.verticalScroll.eCursor.style.transform = "translate(0, " + frame.verticalScroll.position + "px)";
            }

            function moveHorizontalCursor(diff) {
                frame.horizontalScroll.position = eventInfo.startCursorPosition + diff;
                if (frame.horizontalScroll.position < 0) {
                    frame.horizontalScroll.position = 0;
                } else if (frame.horizontalScroll.position > eventInfo.maxCursorPostion) {
                    frame.horizontalScroll.position = eventInfo.maxCursorPostion;
                }
                frame.horizontalScroll.eCursor.style.transform = "translate(" + frame.horizontalScroll.position + "px, 0)";
            }
        }

        function setContentWidth(width) {
            frame.contentWidth = width;
            var viewportWidth = parseInt(frame.eContainer.style.width) - frame.scrollWidth;
            var scrollWidth = parseInt(frame.horizontalScroll.eCursorWrapper.style.width);
            var cursorWidth = viewportWidth / width * scrollWidth;

            if (cursorWidth < frame.cursorSizeMinimum) {
                cursorWidth = frame.cursorSizeMinimum;
            }

            if (width <= viewportWidth) {
                frame.horizontalScroll.eCursor.style.display = "none";
            } else {
                frame.horizontalScroll.eCursor.style.display = "block";
                frame.horizontalScroll.eCursor.style.width = cursorWidth + "px";
            }
        }

        function setContentHeight(height) {
            frame.contentHeight = height;
            var viewportHeight = parseInt(frame.eContainer.style.height) - frame.scrollWidth;
            var scrollHeight = parseInt(frame.verticalScroll.eCursorWrapper.style.height);
            var cursorHeight = viewportHeight / height * scrollHeight;

            if (cursorHeight < frame.cursorSizeMinimum) {
                cursorHeight = frame.cursorSizeMinimum;
            }

            if (height <= viewportHeight) {
                frame.verticalScroll.eCursor.style.display = "none";
            } else {
                frame.verticalScroll.eCursor.style.display = "block";
                frame.verticalScroll.eCursor.style.height = cursorHeight + "px";
            }
        }

        function addSubscriber(subscriber) {
            frame.subscribers.push(subscriber);
        };
    }

    function SimpleTable() {
        var table = this;

        table.headerHeight = 30;
        table.rowHeight = 20;
        table.colModel;
        table.rowModel;
        table.cells = [];
        table.view = { startX: 0, startY: 0, endX: 0, endY: 0 };
        table.beforeView = { startX: 0, startY: 0, endX: 0, endY: 0 };
        table.offsetLeft = 0;
        table.offsetTop = 0;
        table.fixed = { x: 0, y: 0 };

        SimpleTable.prototype.setColModel = function (colModel) {
            table.colModel = colModel;
            var widthSum = 0;
            table.cells.push({});
            for (var c = 0; c < table.colModel.length; c++) {
                table.cells[0][table.colModel[c].dataKey] = {
                    value: table.colModel[c].title,
                    originTop: 0,
                    originLeft: widthSum
                };
                widthSum += table.colModel[c].width;
            }
            frame.setContentWidth(widthSum);
        };

        SimpleTable.prototype.setData = function (data) {
            table.rowModel = [{
                height: table.headerHeight
            }];
            var heightSum = 0;
            for (var r = 0; r < data.length; r++) {
                table.cells.push({});
                table.rowModel.push({
                    height: table.rowHeight
                });
                var widthSum = 0;
                for (var c = 0; c < table.colModel.length; c++) {
                    table.cells[r + 1][table.colModel[c].dataKey] = {
                        value: data[r][table.colModel[c].dataKey],
                        originTop: heightSum,
                        originLeft: widthSum
                    };
                    widthSum += table.colModel[c].width;
                }
                heightSum += table.rowHeight;
            }
            frame.setContentHeight(data.length * table.rowHeight + table.headerHeight);
        };

        SimpleTable.prototype.init = function () {
            frame.addSubscriber(table);
            renderAppend();
        };

        SimpleTable.prototype.onVerticalScrollMoveByUpClick = function () {
            table.beforeView.startX = table.view.startX;
            table.beforeView.startY = table.view.startY;
            table.beforeView.endX = table.view.endX;
            table.beforeView.endY = table.view.endY;
            table.view.startY += -1;
            renderAppend();
            renderRemove();
        };

        SimpleTable.prototype.onVerticalScrollMoveByWrapperUpClick = function () {
        };

        SimpleTable.prototype.onVerticalScrollMoveByDrag = function () {
            var viewportHeight = parseInt(frame.eContainer.style.height) - frame.scrollWidth - 1;
            var scrollHeight = parseInt(frame.verticalScroll.eCursorWrapper.style.height) - parseInt(frame.verticalScroll.eCursor.style.height);
            var scrollTop = (frame.contentHeight - viewportHeight) * frame.verticalScroll.position / scrollHeight;

            var heightSum = 0;
            for (var r = 0; r < table.rowModel.length; r++) {
                if (heightSum >= scrollTop) {
                    table.beforeView.startX = table.view.startX;
                    table.beforeView.startY = table.view.startY;
                    table.beforeView.endX = table.view.endX;
                    table.beforeView.endY = table.view.endY;
                    table.view.startY = r;
                    break;
                }
                heightSum += table.rowModel[r].height;
            }
            renderAppend();
            renderRemove();
        };

        SimpleTable.prototype.onVerticalScrollMoveByWrapperDownClick = function () {
        };

        SimpleTable.prototype.onVerticalScrollMoveByDownClick = function () {
            table.beforeView.startX = table.view.startX;
            table.beforeView.startY = table.view.startY;
            table.beforeView.endX = table.view.endX;
            table.beforeView.endY = table.view.endY;
            table.view.startY += 1;
            renderAppend();
            renderRemove();
        };

        SimpleTable.prototype.onHorizontalScrollMoveByLeftClick = function () {
            table.beforeView.startX = table.view.startX;
            table.beforeView.startY = table.view.startY;
            table.beforeView.endX = table.view.endX;
            table.beforeView.endY = table.view.endY;
            table.view.startX += -1;
            renderAppend();
            renderRemove();
        };

        SimpleTable.prototype.onHorizontalScrollMoveByWrapperLeftClick = function () {
        };

        SimpleTable.prototype.onHorizontalScrollMoveByDrag = function () {
            var viewportWidth = parseInt(frame.eContainer.style.width) - frame.scrollWidth - 1;
            var scrollWidth = parseInt(frame.horizontalScroll.eCursorWrapper.style.width) - parseInt(frame.horizontalScroll.eCursor.style.width);
            var scrollLeft = (frame.contentWidth - viewportWidth) * frame.horizontalScroll.position / scrollWidth;

            var widthSum = 0;
            for (var c = 0; c < table.colModel.length; c++) {
                widthSum += table.colModel[c].width;
                if (widthSum >= scrollLeft) {
                    table.beforeView.startX = table.view.startX;
                    table.beforeView.startY = table.view.startY;
                    table.beforeView.endX = table.view.endX;
                    table.beforeView.endY = table.view.endY;
                    table.view.startX = c;
                    break;
                }
            }
            renderAppend();
            renderRemove();
        };

        SimpleTable.prototype.onHorizontalScrollMoveByWrapperRightClick = function () {
        };

        SimpleTable.prototype.onHorizontalScrollMoveByRightClick = function () {
            table.beforeView.startX = table.view.startX;
            table.beforeView.startY = table.view.startY;
            table.beforeView.endX = table.view.endX;
            table.beforeView.endY = table.view.endY;
            table.view.startX += 1;
            renderAppend();
            renderRemove();
            var cellStart = table.cells[0][table.colModel[table.view.startX].dataKey];
            var cellEnd = table.cells[0][table.colModel[table.view.endX].dataKey];
            
            var viewportWidth = parseInt(frame.eContainer.style.width) - frame.scrollWidth - 1;
            var scrollWidth = parseInt(frame.horizontalScroll.eCursorWrapper.style.width) - parseInt(frame.horizontalScroll.eCursor.style.width);
            var scrollLeft = (frame.contentWidth - viewportWidth) * frame.horizontalScroll.position / scrollWidth;
            
        };

        function renderRemove() {
            renderRemoveFixed2();
            renderRemoveFixed3();
            renderRemoveFixed4();

            function renderRemoveFixed2() {
                for (var r = 0; r <= table.fixed.y; r++) {
                    for (var c = table.beforeView.startX; c <= table.beforeView.endX; c++) {
                        if (c < table.view.startX || c > table.view.endX) {
                            var cell = table.cells[r][table.colModel[c].dataKey];
                            if (cell.element) {
                                frame.eContainer.removeChild(cell.element);
                                cell.element = null;
                            }
                        }
                    }
                }
            }

            function renderRemoveFixed3() {
                for (var r = table.beforeView.startY; r <= table.beforeView.endY; r++) {
                    for (var c = 0; c <= table.fixed.x; c++) {
                        if (r < table.view.startY || r > table.view.endY) {
                            var cell = table.cells[r][table.colModel[c].dataKey];
                            if (cell.element) {
                                frame.eContainer.removeChild(cell.element);
                                cell.element = null;
                            }
                        }
                    }
                }
            }

            function renderRemoveFixed4() {
                for (var r = table.beforeView.startY; r <= table.beforeView.endY; r++) {
                    for (var c = table.beforeView.startX; c <= table.beforeView.endX; c++) {
                        if (c < table.view.startX || c > table.view.endX || r < table.view.startY || r > table.view.endY) {
                            var cell = table.cells[r][table.colModel[c].dataKey];
                            if (cell.element) {
                                frame.eContainer.removeChild(cell.element);
                                cell.element = null;
                            }
                        }
                    }
                }
            }
        }

        function renderAppend() {
            var viewportHeight = parseInt(frame.eContainer.style.height) - frame.scrollWidth - 1;
            var scrollHeight = parseInt(frame.verticalScroll.eCursorWrapper.style.height) - parseInt(frame.verticalScroll.eCursor.style.height);
            var scrollTop = (frame.contentHeight - viewportHeight) * frame.verticalScroll.position / scrollHeight;

            var viewportWidth = parseInt(frame.eContainer.style.width) - frame.scrollWidth - 1;
            var scrollWidth = parseInt(frame.horizontalScroll.eCursorWrapper.style.width) - parseInt(frame.horizontalScroll.eCursor.style.width);
            var scrollLeft = (frame.contentWidth - viewportWidth) * frame.horizontalScroll.position / scrollWidth;

            renderAppendFixed1();
            renderAppendFixed2();
            renderAppendFixed3();
            renderAppendFixed4();

            function renderAppendFixed1() {
                var heightSum = 0;
                for (var r = 0; r < table.fixed.y; r++) {
                    var widthSum = 0;
                    for (var c = 0; c < table.fixed.x; c++) {
                        var cell = table.cells[r][table.colModel[c].dataKey];
                        cell.width = table.colModel[c].width;
                        cell.height = table.rowModel[r].height;
                        cell.left = widthSum;
                        cell.top = heightSum;

                        if (!cell.element) {
                            cell.element = document.createElement("div");
                            cell.element.classList.add("simple-grid-table-cell");
                            cell.element.style.width = cell.width + "px";
                            cell.element.style.height = cell.height + "px";
                            cell.element.innerText = cell.value;
                            frame.eContainer.appendChild(cell.element);
                        }
                        cell.element.style.left = cell.left + "px";
                        cell.element.style.top = cell.top + "px";
                        widthSum += table.colModel[c].width;
                    }
                    heightSum += table.rowModel[r].height;
                }
            }

            function renderAppendFixed2() {
                var leftLimit = 0;
                for (var c = 0; c < table.fixed.x; c++) {
                    leftLimit += table.colModel[c].width;
                }

                var heightSum = table.offsetTop;
                for (var r = 0; r < table.fixed.y; r++) {
                    var widthSum = table.offsetLeft;
                    if (heightSum >= 0 && heightSum < viewportHeight) {
                        for (var c = table.view.startX; c < table.colModel.length; c++) {
                            var cell = table.cells[r][table.colModel[c].dataKey];
                            cell.width = table.colModel[c].width;
                            cell.height = table.rowModel[r].height;
                            cell.left = widthSum + leftLimit;
                            cell.top = heightSum;

                            if (widthSum >= 0 && widthSum + leftLimit < viewportWidth) {
                                if (!cell.element) {
                                    cell.element = document.createElement("div");
                                    cell.element.classList.add("simple-grid-table-cell");
                                    cell.element.style.width = cell.width + "px";
                                    cell.element.style.height = cell.height + "px";
                                    cell.element.innerText = cell.value;
                                    frame.eContainer.appendChild(cell.element);
                                }
                                cell.element.style.left = cell.left + "px";
                                cell.element.style.top = cell.top + "px";
                                table.view.endX = c;
                            } else if (widthSum >= viewportWidth) {
                                break;
                            }
                            widthSum += table.colModel[c].width;
                        }
                        table.view.endY = r;
                    } else if (heightSum >= viewportHeight) {
                        break;
                    }
                    heightSum += table.rowModel[r].height;
                }
            }

            function renderAppendFixed3() {
                var topLimit = 0;
                for (var r = 0; r < table.fixed.y; r++) {
                    topLimit += table.rowModel[r].height;
                }

                var heightSum = table.offsetTop;
                for (var r = table.view.startY; r < table.rowModel.length; r++) {
                    var widthSum = table.offsetLeft;
                    if (heightSum >= 0 && heightSum + topLimit < viewportHeight) {
                        for (var c = 0; c < table.fixed.x; c++) {
                            var cell = table.cells[r][table.colModel[c].dataKey];
                            cell.width = table.colModel[c].width;
                            cell.height = table.rowModel[r].height;
                            cell.left = widthSum;
                            cell.top = heightSum + topLimit;

                            if (widthSum >= 0 && widthSum < viewportWidth) {
                                if (!cell.element) {
                                    cell.element = document.createElement("div");
                                    cell.element.classList.add("simple-grid-table-cell");
                                    cell.element.style.width = cell.width + "px";
                                    cell.element.style.height = cell.height + "px";
                                    cell.element.innerText = cell.value;
                                    frame.eContainer.appendChild(cell.element);
                                }
                                cell.element.style.left = cell.left + "px";
                                cell.element.style.top = cell.top + "px";
                                table.view.endX = c;
                            } else if (widthSum >= viewportWidth) {
                                break;
                            }
                            widthSum += table.colModel[c].width;
                        }
                        table.view.endY = r;
                    } else if (heightSum >= viewportHeight) {
                        break;
                    }
                    heightSum += table.rowModel[r].height;
                }
            }

            function renderAppendFixed4() {
                var topLimit = 0;
                var leftLimit = 0;
                for (var r = 0; r < table.fixed.y; r++) {
                    topLimit += table.rowModel[r].height;
                }

                for (var c = 0; c < table.fixed.x; c++) {
                    leftLimit += table.colModel[c].width;
                }

                var heightSum = table.offsetTop;
                for (var r = table.view.startY; r < table.cells.length; r++) {
                    var widthSum = table.offsetLeft;
                    if (heightSum >= 0 && heightSum + topLimit < viewportHeight) {
                        for (var c = table.view.startX; c < table.colModel.length; c++) {
                            var cell = table.cells[r][table.colModel[c].dataKey];
                            cell.width = table.colModel[c].width;
                            cell.height = table.rowModel[r].height;
                            cell.left = widthSum + leftLimit;
                            cell.top = heightSum + topLimit;

                            if (widthSum >= 0 && widthSum + leftLimit < viewportWidth) {
                                if (!cell.element) {
                                    cell.element = document.createElement("div");
                                    cell.element.classList.add("simple-grid-table-cell");
                                    cell.element.style.width = cell.width + "px";
                                    cell.element.style.height = cell.height + "px";
                                    cell.element.innerText = cell.value;
                                    frame.eContainer.appendChild(cell.element);
                                }
                                cell.element.style.left = cell.left + "px";
                                cell.element.style.top = cell.top + "px";
                                table.view.endX = c;
                            } else if (widthSum >= viewportWidth) {
                                break;
                            }
                            widthSum += table.colModel[c].width;
                        }
                        table.view.endY = r;
                    } else if (heightSum >= viewportHeight) {
                        break;
                    }
                    heightSum += table.rowModel[r].height;
                }
            }
        }
    }
}