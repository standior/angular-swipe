'use strict';

angular.module('angular-swiper', ['ngTouch'])
  .directive('swipeGlue', function($swipe) {
    return {
      scope: {
        swipeIndex: '=?'
      },
      link: function(scope, element) {
        var ulWidth = 0,
          ulHeight = 0,
          liWidth = 0,
          startMove = 0,
          startTransform = 0,
          MOVE_BUFFER_RADIUS = 40,
          handlers = {
            'start': function(coords) {
              //console.log('start', coords);
              startTransform = getOffsetFromCss(element[0].style['-webkit-transform']);
              startTransform = startTransform && startTransform[0];
              //console.log('element.css.transform  now is :', startTransform);
              startMove = coords.x;

            },
            'cancel': function() {
              //console.log('cancel');
            },
            'move': function(coords) {
              //console.log('move', coords);
              var offsetX = startMove - coords.x,_translate=getOffset(offsetX);
              // var newX =  coords.x;
              if ((offsetX&&offsetX>MOVE_BUFFER_RADIUS)||(offsetX&&offsetX<-MOVE_BUFFER_RADIUS)) {

                  move(_translate);
                //startMove = newX;
              }
            },
            'end': function(coords) {
              //console.log('end', coords);
              scope.$apply(function() {
                if (startMove - coords.x > 0) {
                  //scope.swipeRight();
                } else {
                  //scope.swipeLeft();
                }
                startMove = 0;
              });
            }
          };



        function move(x) {
          //console.log('index', scope.swipeIndex);
          var moveX = x || (scope.swipeIndex * liWidth);
         
             if (moveX > ulWidth) {
                
                moveX=ulWidth-liWidth;
                console.log("is the length", getOffsetFromCss(element[0].style['-webkit-transform']));
                   
              }
          var  translate = "translateX(-" + moveX + "px)";
          element.css({
            '-webkit-transform': translate,
            '-moz-transform': translate,
            '-o-transform': translate,
            '-ms-transform': translate,
            transform: translate
          });
          //console.log("moved length is :",moveX,"px");
          //console.log("translate length is :",translate);

        };

        function getOffset(x) {
          //console.log('index', scope.swipeIndex);
          var moveX = x,
            tranposition = (parseInt(startTransform) + moveX);
        
          return tranposition;
        };

        function getOffsetFromCss(transform) {
          return /\d+/.exec(transform);
        };

        scope.$watch('swipeIndex', function() {
          move();
        });

        scope.swipeRight = function() {
          //console.log('index', scope.swipeIndex);
          scope.swipeIndex = scope.swipeIndex + 1;
          move();
        };

        scope.swipeLeft = function() {
          if (scope.swipeIndex > 0) {
            //console.log('index', scope.swipeIndex);
            scope.swipeIndex = scope.swipeIndex - 1;
          }
          move();
        };

        $swipe.bind(element, handlers);

        if (element.children && element.children.length > 0) {
          var li;
          liWidth = element.children()[0].offsetWidth;

          for (var i = 0; i < element.children().length; i++) {
            li = element.children()[i];
            ulWidth += li.offsetWidth;
            if (ulHeight < li.offsetHeight) {
              ulHeight = li.offsetHeight;
            }
          }
          element.addClass('swipe-glue');
          element.css({
            width: ulWidth + 'px',
            height: ulHeight + 'px'
          });
        };

        if (angular.isUndefined(scope.swipeIndex)) {
          scope.swipeIndex = 0;
        };


      }
    };
  });