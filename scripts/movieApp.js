
var movieApp = angular.module("movieApp", ["ngRoute", "mrMr", "ui.bootstrap"]);

var appVersion = 0.01;

movieApp.run(function ($rootScope) {

});

movieApp.config(['$provide', '$routeProvider', function ($provide, $routeProvider) {

    $provide.decorator('$exceptionHandler', function ($delegate, errorService) {

        return function (exception, cause) {
            $delegate(exception, cause);
            errorService.logError("Totalt øv fejl!\r\n\r\nException:\r\n" + exception + "\r\n\r\nCause:\r\n" + cause);
        };
    });

    $routeProvider
        .when("/", {
            template: `
                    <form class="form-inline d-flex" ng-submit="searchForMovies()">
                        <input type="text" class="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" id="inputEmail" placeholder="Search for title..." ng-model="movieSearch" />
                        <button type="submit" class="btn btn-primary mx-auto">Submit</button>
                    </form>
                    <br/>
                    <div class="row">
                        <div class="col-sm-4 movieSelect">
                            <select class="form-control" ng-model="movieType">
                                <option value="">All Types </option>
                                <option value="series">Series Only </option>
                                <option value="movie">Movies Only </option>
                                <option value="episode">Episodes Only </option>
                            </select>
                        </div>
                      <div class="col-sm-4 movieSelect">
                            <select class="form-control" ng-model="moviePlot">
                                <option value="">All Plots </option>
                                <option value="short">Short Plot </option>
                                <option value="full">Full Plot </option>
                            </select>
                        </div>
                      <div class="col-sm-4 movieSelect">
                            <select class="form-control" ng-model="movieYear" ng-options="y for y in availableYears | orderBy : y : true">
                                <option value="">All Years </option>
                            </select>
                        </div>
                    </div>
                   <div class="container" ng-show="loadingMovies">
                     <br/>
                     <mrspin color="gold" size="100"></mrspin>
                   </div>
                    <div class="mrsGold" ng-hide="!loadingMovies && movies && movies.Search.length > 0">
                        <br/>
                        <p>Configure your search with the input fields above and then press submit when you are ready to launch it. It is required by the OMDb API that the search field is not empty. Furthermore, there is a daily limit of 1000 requests per API-key. Good luck!</p>
                        <br/>
                    </div>
                   <div class="row" ng-show="!loadingMovies">
                        <div class="movieCardContainer col-md-4 mb-3 mb-md-0" ng-repeat="m in movies.Search" >
                            <div class="movieCard mrShrink card py-4 h-100" ng-click="getMovieDetails(m.imdbID)" data-toggle="modal" data-target="#movieModal">
                                <div class="card-body text-center">
                                    <i class="fas fa-star text-primary mb-2"></i>
                                    <h4 class="text-uppercase m-0" ng-bind="m.Title"></h4>
                                    <hr class="my-4">
                                    <img src="{{m.Poster}}" alt="{{m.Title}}" title="More about {{m.Title}}" />
                                                    <hr class="my-4">
                                    <h4 class="text-uppercase m-0" ng-bind="m.Year + ', ' + m.Type"></h4>
                                </div>
                            </div>
                        </div>     
              <div class="modal" id="movieModal">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="text-uppercase m-0" ng-bind="selectedMovie.Title"></h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                      <img src="{{selectedMovie.Poster}}" alt="{{selectedMovie.Title}}" title="{{selectedMovie.Title}}" />
                      <table class="table">
                        <tbody>
                          <tr>
                            <td>Your Rating</td>
                            <td>
                               <i ng-click="selectedMovie.Rate = 1; updateRate(selectedMovie)" ng-class="selectedMovie.Rate >= 1 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="selectedMovie.Rate = 2; updateRate(selectedMovie)" ng-class="selectedMovie.Rate >= 2 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="selectedMovie.Rate = 3; updateRate(selectedMovie)" ng-class="selectedMovie.Rate >= 3 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="selectedMovie.Rate = 4; updateRate(selectedMovie)" ng-class="selectedMovie.Rate >= 4 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="selectedMovie.Rate = 5; updateRate(selectedMovie)" ng-class="selectedMovie.Rate == 5 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                            </td>
                          </tr> 
                          <tr>
                            <td>Released</td>
                            <td ng-bind="selectedMovie.Released"></td>
                          </tr>
                          <tr>
                            <td>Runtime</td>
                            <td ng-bind="selectedMovie.Runtime"></td>
                          </tr>
                          <tr>
                            <td>Genre</td>
                            <td ng-bind="selectedMovie.Genre"></td>
                          </tr>
                         <tr>
                            <td>Country</td>
                            <td ng-bind="selectedMovie.Country"></td>
                          </tr>
                          <tr>
                            <td>Language</td>
                            <td ng-bind="selectedMovie.Language"></td>
                          </tr>
                          <tr>
                            <td>Director</td>
                            <td ng-bind="selectedMovie.Director"></td>
                          </tr>
                          <tr>
                            <td>Writer</td>
                            <td ng-bind="selectedMovie.Writer"></td>
                          </tr>            
                          <tr>
                            <td>Actors</td>
                            <td ng-bind="selectedMovie.Actors"></td>
                          </tr>    
                          <tr>
                          <td>Plot</td>
                          <td ng-bind="selectedMovie.Plot"></td>
                        </tr>                                                                                        
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        <ul ng-show="!loadingMovies && movies && movies.Search.length > 0" uib-pagination total-items="movies.totalResults" ng-model="moviePage" max-size="10" class="pagination-sm" boundary-link-numbers="true" rotate="false" ng-click="searchForMovies()"></ul> 
        <h2 class="mrsGold" ng-show="favourites.length > 0">Your Favourites</h2>
            <div class="row" ng-show="favourites.length > 0">                
                <div class="movieCardContainer col-md-4 mb-3 mb-md-0" ng-repeat="m in favourites track by m.imdbID" >
                    <div class="card py-4 h-100">
                        <div class="card-body text-center">
                        <button type="button" class="close" ng-click="removeRate(m.imdbID)">&times;</button>
                            <i ng-click="m.Rate = 1; updateRate(m)" ng-class="m.Rate >= 1 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="m.Rate = 2; updateRate(m)" ng-class="m.Rate >= 2 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="m.Rate = 3; updateRate(m)" ng-class="m.Rate >= 3 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="m.Rate = 4; updateRate(m)" ng-class="m.Rate >= 4 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                               <i ng-click="m.Rate = 5; updateRate(m)" ng-class="m.Rate == 5 ? 'text-primary' : ''" class="fas fa-star mb-2 starRate"></i>
                                <h4 class="text-uppercase m-0" ng-bind="m.Title"></h4>
                                <hr class="my-4">
                                <img src="{{m.Poster}}" alt="{{m.Title}}" title="More about {{m.Title}}" />
                                <hr class="my-4">
                                <h4 class="text-uppercase m-0" ng-bind="m.Year + ', ' + m.Type"></h4>
                        </div>
                    </div>
                </div>
            </div>
        <br ng-show="favourites.length > 0" />

        `,
            controller: "mainController"
        });

}]);

movieApp.controller("mainController", ["$scope", "dataService", "messageService", function ($scope, dataService, messageService) {
    $scope.movieSearch = "";
	$scope.thisYear = new Date().getFullYear();
    $scope.availableYears = new Array();
    for (let y = 1888; y <= $scope.thisYear; y++) {
        $scope.availableYears.push(y);
    }
    $scope.favourites = localStorage["favouriteMovies"] ? JSON.parse(localStorage["favouriteMovies"]) : new Array();
    $scope.moviePage = 1;
    $scope.searchForMovies = function () {
        $scope.loadingMovies = true;  
        dataService.getMovieList($scope.apiUrl, $scope.apiKey, $scope.movieSearch, $scope.moviePage, $scope.movieType, $scope.moviePlot, $scope.movieYear).then(function (result) {
            $scope.movies = result.data;
        }).finally(function () {
            $scope.loadingMovies = false;
        });
    };
    $scope.getMovieDetails = function (id) {
        dataService.getMovieById($scope.apiUrl, $scope.apiKey, id).then(function (result) {
            $scope.selectedMovie = result.data;

            var index = $scope.favourites.findIndex(x => x.imdbID === $scope.selectedMovie.imdbID);

            if (index > -1) {
                $scope.selectedMovie.Rate = $scope.favourites[index].Rate;
            }
            else {
                $scope.selectedMovie.Rate = 0;
            }
        });
    };
    $scope.updateRate = function (movie) {
        var index = $scope.favourites.findIndex(x => x.imdbID === movie.imdbID);

        if (index > -1) {
            $scope.favourites[index].Rate = movie.Rate;
        }
        else {
            $scope.favourites.push(movie);
        } 
        localStorage["favouriteMovies"] = JSON.stringify($scope.favourites);
    };
    $scope.removeRate = function (id) {
        var ok = messageService.confirm("Are you sure you want to remove this movie from your favourites?");

        if (ok) {
            var index = $scope.favourites.findIndex(x => x.imdbID === id);

            if (index > -1) {
                $scope.favourites.splice(index, 1);
            }
            localStorage["favouriteMovies"] = JSON.stringify($scope.favourites);
        }
    };
}]);

movieApp.service("errorService", ["messageService", function (messageService) {
    this.logError = function (exception, cause, message) {
        if (exception) {
            if (message) {
                messageService.error(message);
            } else if (exception) {
                if (exception.message) {
                    messageService.error(exception.message);
                } else if (exception.statusText) {
                    messageService.error(exception.statusText);
                } else {
                    messageService.error(exception);
                }
            }

            var error = {
                "Exception": exception,
                "Cause": cause,
                "Navigator": navigator
            };

            console.log(error);
        }
    };
}]);

movieApp.service("messageService", [function () {
    this.success = function (body, title) {
        toastr.success(body, title, this.options);
    };
    this.warning = function (body, title) {
        toastr.warning(body, title, this.options);
    };
    this.error = function (body, title) {
        toastr.error(body, title, this.options);
    };
    this.info = function (body, title) {
        toastr.info(body, title, this.options);
    };
    this.confirm = function (body) {
        if (!body) {
            body = "Are you sure?";
        }
        return confirm(body);
    };
    this.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": true,
        "showDuration": "300",
        "hideDuration": "500",
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}]);

movieApp.service("dataService", ["$http", "messageService", "errorService", function ($http, messageService, errorService) {
    this.getMovieList = function (url, key, search, page, type, plot, year) {
        return $http.get(url + "/?apikey=" + key +
            "&s=" + search +
            "&page=" + page +
            (type ? "&type=" + type : '') +
            (plot ? "&plot=" + plot : '') +
            (year ? "&y=" + year : '')
        )
            .then(function (result) {
                if (result.data.Response !== "True") {
                    errorService.logError(result.data.Error);
                }
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };

    this.getMovieById = function (url, key, id) {
        return $http.get(url + "/?apikey=" + key + "&i=" + id)
            .then(function (result) {
                if (result.data.Response !== "True") {
                    errorService.logError(result.data.Error);
                }
                return result;
            })
            .catch(function (result) {
                errorService.logError(result);
            });
    };

}]);