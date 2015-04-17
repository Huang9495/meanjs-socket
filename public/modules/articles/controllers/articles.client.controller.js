'use strict';

angular.module('articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Articles', 'socket',
	function($scope, $stateParams, $location, Authentication, Articles, socket) {
		$scope.authentication = Authentication;

        console.log('loaded client controller containing socket reference ....');
        $scope.socketMessages = [];

        //[mo]
        socket.on('article.created', function(article) {
            console.log('WebSocketMagic: '+ JSON.stringify(article) );
            $scope.socketMessages.push({title:article.title, user:article.user});
            console.log('socketMessage count: ' + $scope.socketMessages.length);
        });

        //[mo]
        $scope.transmitMessage = '';
        $scope.transmit = function(){
            console.log('WebSocket outgoing: '+ $scope.transmitMessage );
            socket.emit('transmit.message', $scope.transmitMessage);
        };

		$scope.create = function() {
			var article = new Articles({
				title: this.title,
				content: this.content
			});
			article.$save(function(response) {
				$location.path('articles/' + response._id);

				$scope.title = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(article) {
			if (article) {
				article.$remove();

				for (var i in $scope.articles) {
					if ($scope.articles[i] === article) {
						$scope.articles.splice(i, 1);
					}
				}
			} else {
				$scope.article.$remove(function() {
					$location.path('articles');
				});
			}
		};

		$scope.update = function() {
			var article = $scope.article;

			article.$update(function() {
				$location.path('articles/' + article._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.articles = Articles.query();
		};

		$scope.findOne = function() {
			$scope.article = Articles.get({
				articleId: $stateParams.articleId
			});
		};
	}
]);
