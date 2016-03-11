(function() {
  var app;

  app = angular.module('app', ['ui.router', 'ngSanitize', 'ngRoute', 'ngAnimate', 'ngMaterial', 'templates', 'pascalprecht.translate', 'ngLocale', 'ngCookies', 'ngMessages', 'tmh.dynamicLocale', 'LocalStorageModule']);

  app.config(function($mdThemingProvider) {
    return $mdThemingProvider.theme('default').primaryPalette('teal');
  });

  app.config(function($translateProvider, tmhDynamicLocaleProvider) {
    var locale;
    $translateProvider.useCookieStorage();
    $translateProvider.useStaticFilesLoader({
      prefix: '/locales/',
      suffix: '.json'
    });
    locale = document.querySelector('body').getAttribute('locale');
    if (!locale) {
      locale = "en-us";
    }
    $translateProvider.preferredLanguage('en');
    tmhDynamicLocaleProvider.localeLocationPattern('/locales/angular-locale_{{locale}}.js');
    return tmhDynamicLocaleProvider.defaultLocale('en-us');
  });

  angular.element(document).ready(function() {
    return angular.bootstrap(document, ["app"]);
  });

}).call(this);

(function() {
  angular.module('app').config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $urlRouterProvider.otherwise("/");
    return $stateProvider.state('main', {
      url: '/',
      abstract: false,
      views: {
        root: {
          templateUrl: 'cards.html',
          controller: 'CardsCtrl'
        }
      }
    });
  });

}).call(this);

(function() {
  angular.module("app").controller("CardsCtrl", function($scope, $state, $translate, $timeout) {
    $scope.basic_colors = ['#F44336', '#9C27B0', '#3F51B5', '#009688', '#CDDC39', '#FF5722', '#795548', '#607D8B'];
    $scope.completed = false;
    $scope.init = function() {
      var card, i, index, j, len, ref, results;
      $scope.completed = false;
      $scope.colors = $scope.basic_colors;
      $scope.colors = _.shuffle($scope.colors.concat($scope.colors));
      $scope.buffer = [];
      $scope.cards = [];
      ref = $scope.colors;
      results = [];
      for (index = j = 0, len = ref.length; j < len; index = ++j) {
        i = ref[index];
        card = {
          color: i,
          done: false,
          close: true,
          id: index
        };
        results.push($scope.cards.push(card));
      }
      return results;
    };
    $scope.item_state = function(item) {
      if (item.close && !item.done) {
        return true;
      } else {
        return false;
      }
    };
    $scope.toggle = function(item) {
      var is_selected, left;
      if (!item.done) {
        is_selected = $scope.buffer.indexOf(item);
        if (is_selected === -1) {
          switch ($scope.buffer.length) {
            case 0:
              item.close = false;
              return $scope.buffer.push(item);
            case 1:
              item.close = false;
              if ($scope.buffer[0].color === item.color) {
                $scope.buffer[0].done = true;
                item.done = true;
                $scope.buffer = [];
                left = _.where($scope.cards, {
                  done: false
                });
                if (left.length === 0) {
                  $scope.completed = true;
                  return console.log('hello');
                }
              } else {
                return $scope.buffer.push(item);
              }
              break;
            case 2:
              $scope.buffer[0].close = true;
              $scope.buffer[1].close = true;
              $scope.buffer = [];
              item.close = false;
              return $scope.buffer.push(item);
          }
        }
      }
    };
    return $scope.init();
  });

}).call(this);


/**
* @ngdoc directive
* @name rowWrapFill
* @element area
 */

(function() {
  angular.module("app").directive("rowWrapFill", function($compile) {
    return {
      restrict: 'A',
      scope: {},
      link: function(scope, elm, attrs) {
        var blank_node, border, child_width, i, j, length, max_column, node, parent_width, ref, results, temp, theStyle, to_add;
        if (scope.$parent.$last) {
          parent_width = elm[0].parentNode.clientWidth;
          child_width = elm[0].clientWidth;
          length = scope.$parent.$index + 1;
          if (length > 0) {
            theStyle = window.getComputedStyle(elm[0], null);
            if (theStyle.boxSizing === 'border-box') {
              border = theStyle.borderWidth;
              border = parseInt(border.replace('px', ''));
              child_width += border * 2;
            }
            max_column = Math.floor(parent_width / child_width);
            temp = length % max_column;
            if (temp !== 0) {
              to_add = Math.abs(max_column - temp);
              results = [];
              for (i = j = 0, ref = to_add; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
                blank_node = '<div style="width: ' + child_width + 'px;box-sizing: border-box;"></div>';
                node = $compile(blank_node)(scope);
                results.push(elm.parent().append(node));
              }
              return results;
            }
          }
        }
      }
    };
  });

}).call(this);

(function() {
  angular.module('app').factory('ChartConfig', function() {
    var result;
    result = {};
    result.options_main = {
      height: "350px",
      width: "900px",
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 1
      }),
      showPoint: false,
      low: 0,
      chartPadding: 30,
      showArea: true,
      showPoint: true,
      showLine: true,
      onlyInteger: true,
      axisX: {
        showGrid: false,
        labelOffset: {
          x: 0,
          y: 10
        }
      },
      axisY: {
        offset: 40,
        showGrid: true
      },
      classNames: {
        label: 'md-caption main_chart-ct-label',
        line: 'main_chart-ct-line',
        area: 'main_chart-ct-area',
        grid: 'main_chart-ct-grid'
      },
      plugins: [
        Chartist.plugins.tooltip({
          "class": "element-chart_tooltip",
          pointClass: 'main_chart-ct-point'
        })
      ]
    };
    result.options_profiles = {
      height: "200px",
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 1
      }),
      showPoint: false,
      low: 0,
      chartPadding: {
        top: 15,
        right: 25,
        bottom: 5,
        left: 10
      },
      showArea: false,
      showPoint: true,
      showLine: true,
      fullWidth: false,
      onlyInteger: true,
      axisX: {
        showGrid: true,
        showLabel: true,
        labelOffset: {
          x: 0,
          y: 10
        }
      },
      axisY: {
        showGrid: true,
        showLabel: true
      },
      classNames: {
        line: 'ext_chart-ct-line',
        grid: 'ext_chart-ct-grid',
        point: 'ext_chart-ct-point'
      }
    };
    result.options_cpu = {
      width: "100%",
      height: "240px",
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 1
      }),
      showPoint: false,
      low: 0,
      chartPadding: 0,
      showArea: false,
      showPoint: true,
      showLine: true,
      onlyInteger: true,
      chartPadding: {
        top: 55,
        right: 20,
        bottom: 20,
        left: 10
      },
      axisX: {
        showGrid: true,
        showLabel: true,
        labelOffset: {
          x: 0,
          y: 10
        }
      },
      axisY: {
        showGrid: true,
        showLabel: false
      },
      classNames: {
        line: 'cpu_chart-ct-line',
        grid: 'cpu_chart-grid',
        point: 'cpu_chart-ct-point'
      }
    };
    return result;
  });

}).call(this);

(function() {
  angular.module('app').factory('MainHelper', function($window) {
    var result;
    result = {};
    result.worker_data = function(worker, job) {
      var i, j, json, len, parameter, ref;
      json = {
        name: worker.name,
        job: job.name,
        avatar: worker.avatar,
        params: []
      };
      ref = job.params;
      for (j = 0, len = ref.length; j < len; j++) {
        i = ref[j];
        parameter = i;
        parameter.value = worker.values[i.id];
        switch (i.type) {
          case 'file':
            parameter.actions = {
              open: function(url) {
                $window.open(url);
                return false;
              }
            };
            break;
          case 'date':
            if (parameter.value) {
              parameter.value = new Date(parameter.value);
            }
            break;
          case 'gallery':
            i.index = 0;
            if (!i.value) {
              item.value = [];
            }
            i.current = i.value[i.index];
            i.max = i.value.length;
            i.next = function(item) {
              item.index++;
              return item.current = item.value[item.index];
            };
            i.prev = function(item) {
              item.index--;
              return item.current = item.value[item.index];
            };
        }
        json.params.push(parameter);
      }
      return json;
    };
    result.select_active_tab = function(state) {
      var index;
      index = 0;
      if (state.indexOf('workers') !== -1) {
        index = 0;
      }
      if (state.indexOf('jobs') !== -1) {
        index = 1;
      }
      if (state.indexOf('stat') !== -1) {
        index = 2;
      }
      return index;
    };
    result.is_new = function(state) {
      if (state.indexOf('list') !== -1) {
        return true;
      } else {
        return false;
      }
    };
    result.configure_params_workers = function(params, search, job, ext_search_params) {
      var i, is_ext, j, json, k, len, len1;
      is_ext = false;
      for (j = 0, len = ext_search_params.length; j < len; j++) {
        i = ext_search_params[j];
        if (i.value) {
          is_ext = true;
          break;
        }
      }
      json = {};
      json.limit = params.limit;
      json.skip = (params.index_page - 1) * json.limit;
      json.where = {};
      if (is_ext) {
        json.where = {};
        for (k = 0, len1 = ext_search_params.length; k < len1; k++) {
          i = ext_search_params[k];
          if (i.value) {
            if (!i.compare) {
              json.where['values.' + i.id] = i.value;
              if (i.type === 'string' || i.type === 'text') {
                json.where['values.' + i.id] = {
                  'contains': i.value
                };
              }
            } else {
              if (i.compare_value.value === '=') {
                json.where['values.' + i.id] = i.value;
              } else {
                json.where['values.' + i.id] = {};
                json.where['values.' + i.id][i.compare_value.value] = i.value;
              }
            }
          }
        }
      } else {
        if (search) {
          json.where.name = {
            'contains': search
          };
        }
        if (job && !search) {
          if (job) {
            json.where.job = job;
          }
        }
      }
      if (params.sort[0] === '-') {
        json.sort = params.sort.substr(1) + ' desc';
      } else {
        json.sort = params.sort + ' asc';
      }
      return json;
    };
    result.configure_params_jobs = function(params, search) {
      var ans;
      ans = {};
      ans.limit = params.limit;
      ans.skip = (params.index_page - 1) * ans.limit;
      if (search) {
        ans.where = {
          'name': {
            'contains': search
          }
        };
      }
      if (params.sort[0] === '-') {
        ans.sort = params.sort.substr(1) + ' desc';
      } else {
        ans.sort = params.sort + ' asc';
      }
      return ans;
    };
    result.counter_params = function(name_query, selected_job, ext_search_params) {
      var i, is_ext, j, json, k, len, len1;
      json = {};
      is_ext = false;
      for (j = 0, len = ext_search_params.length; j < len; j++) {
        i = ext_search_params[j];
        if (i.value) {
          is_ext = true;
          break;
        }
      }
      if (is_ext) {
        json.querybig = {};
        json.querybig.where = {};
        for (k = 0, len1 = ext_search_params.length; k < len1; k++) {
          i = ext_search_params[k];
          if (i.value) {
            if (!i.compare) {
              json.querybig.where['values.' + i.id] = i.value;
            } else {
              if (i.compare_value.value === '=') {
                json.querybig.where['values.' + i.id] = i.value;
              } else {
                json.querybig.where['values.' + i.id] = {};
                json.querybig.where['values.' + i.id][i.compare_value.value] = i.value;
              }
            }
          }
        }
      } else {
        if (name_query) {
          json.query = name_query;
        } else {
          json.id = selected_job;
        }
      }
      return json;
    };
    result.is_save_disabled = function(worker) {
      var a, i, j, len, ref;
      a = false;
      if (worker.parameters) {
        ref = worker.parameters;
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          if (i.value) {
            if (i.value.loading) {
              a = true;
              break;
            }
          }
        }
      }
      if (worker.avatar.loading) {
        a = true;
      }
      if (worker.saving_process) {
        a = true;
      }
      if (!worker.name) {
        a = true;
      } else {
        if (worker.name.length < 3) {
          a = true;
        }
      }
      return a;
    };
    return result;
  });

}).call(this);

(function() {
  angular.module('app').value('genius', function(valuer) {
    var g;
    g = valuer * 21;
    return g;
  });

}).call(this);

(function() {
  angular.module("app").directive("editorBoolean", function() {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/boolean.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          return scope.value = ngModel.$viewValue;
        };
        return scope.$watch('value', function() {
          return ngModel.$setViewValue({
            value: scope.value,
            filled: true
          });
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorDate", function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/date.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          return scope.value = new Date(ngModel.$viewValue);
        };
        return scope.$watch('value', function() {
          if (scope.value) {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: false
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorFile", function(Upload, $window) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/file.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          scope.file = ngModel.$viewValue;
          scope.loading = false;
          return scope.prepare();
        };
        scope.prepare = function() {
          if (scope.file.url) {
            return ngModel.$setViewValue({
              value: scope.file,
              loading: scope.loading,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.file,
              loading: scope.loading,
              filled: false
            });
          }
        };
        return scope.actions = {
          open: function(link) {
            if (link) {
              $window.open(link);
            }
            return false;
          },
          "delete": function() {
            scope.file = {
              url: '',
              name: ''
            };
            scope.loading = false;
            return scope.prepare();
          },
          upload: function(files) {
            var appload, file, path;
            if (files && files.length) {
              file = files[0];
              scope.file.name = file.name;
              scope.loading = 1;
              scope.prepare();
              path = 'http://app.vnedesign.ru/api/jobs/uploadFile';
              appload = Upload.upload({
                url: path,
                file: file,
                fileFormDataName: "file",
                withCredentials: true,
                method: 'POST'
              });
              return appload.then(function(resp) {
                scope.file.url = 'http://s3.amazonaws.com/polymath-storage/' + resp.data.files[0].fd;
                scope.loading = false;
                return scope.prepare();
              }, function(resp) {
                return console.log('upload error');
              }, function(evt) {
                var value;
                value = parseInt(100.0 * evt.loaded / evt.total);
                return scope.loading = value;
              });
            }
          }
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorGallery", function($timeout, FileReader, Upload, $window) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/gallery.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          scope.photos = ngModel.$viewValue;
          return scope.prepare();
        };
        scope.prepare = function() {
          var i, j, json, len, ref;
          json = {
            value: scope.photos,
            loading: false,
            filled: false
          };
          ref = json.value;
          for (j = 0, len = ref.length; j < len; j++) {
            i = ref[j];
            if (i.url) {
              json.filled = true;
            }
            if (i.progress) {
              json.loading = true;
              break;
            }
          }
          return ngModel.$setViewValue(json);
        };
        return scope.actions = {
          open: function(link) {
            if (link) {
              $window.open(link);
            }
            return false;
          },
          "delete": function(item) {
            _.remove(scope.photos, item);
            return scope.prepare();
          },
          pre_upload: function(files) {
            var i, j, len, results;
            if (files) {
              results = [];
              for (j = 0, len = files.length; j < len; j++) {
                i = files[j];
                results.push(this.upload([i]));
              }
              return results;
            }
          },
          upload: function(files) {
            var file;
            if (files && files.length) {
              file = files[0];
              return FileReader.readAsDataURL(file, scope).then(function(data_url) {
                var appload, file_object, path;
                scope.photos.push({
                  url: "",
                  data_url: data_url,
                  progress: 1
                });
                file_object = _.last(scope.photos);
                scope.prepare();
                path = 'http://app.vnedesign.ru/api/jobs/uploadFile';
                appload = Upload.upload({
                  url: path,
                  file: file,
                  fileFormDataName: "file",
                  withCredentials: true,
                  method: 'POST'
                });
                return appload.then(function(resp) {
                  file_object.url = 'http://s3.amazonaws.com/polymath-storage/' + resp.data.files[0].fd;
                  file_object.progress = void 0;
                  return scope.prepare();
                }, function(resp) {
                  return console.log('upload error');
                }, function(evt) {
                  var value;
                  value = parseInt(100.0 * evt.loaded / evt.total);
                  return file_object.progress = value;
                });
              });
            }
          }
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorMultiSelect", function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/multi_select.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          scope.selected = ngModel.$viewValue.selected;
          return scope.list = ngModel.$viewValue.list;
        };
        return scope.$watch('selected', function() {
          if (scope.selected.length > 0) {
            return ngModel.$setViewValue({
              value: scope.selected,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.selected,
              filled: false
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorNumber", function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/number.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          return scope.value = ngModel.$viewValue;
        };
        return scope.$watch('value', function() {
          if (scope.value) {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: false
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorSelect", function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/select.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          scope.selected = ngModel.$viewValue.selected;
          return scope.list = ngModel.$viewValue.list;
        };
        return scope.$watch('selected', function() {
          ngModel.$setViewValue(scope.selected);
          if (scope.selected.length > 0) {
            return ngModel.$setViewValue({
              value: scope.selected,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.selected,
              filled: false
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorString", function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/string.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          return scope.value = ngModel.$viewValue;
        };
        return scope.$watch('value', function() {
          if (scope.value) {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: false
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("editorText", function($timeout) {
    return {
      restrict: 'E',
      require: 'ngModel',
      templateUrl: "admin_panel/workers/editor_types/text.html",
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        ngModel.$render = function() {
          return scope.value = ngModel.$viewValue;
        };
        return scope.$watch('value', function() {
          if (scope.value) {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: true
            });
          } else {
            return ngModel.$setViewValue({
              value: scope.value,
              filled: false
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("componentDataRing", function($timeout) {
    return {
      restrict: 'E',
      templateUrl: "data_ring/data_ring.html",
      require: 'ngModel',
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        return ngModel.$render = function() {
          var circle;
          circle = angular.element(elm).find('div');
          scope.value = ngModel.$viewValue;
          circle.removeClass('green');
          circle.removeClass('yellow');
          circle.removeClass('red');
          if (scope.value < 25) {
            circle.addClass('green');
          }
          if ((scope.value >= 25) && (scope.value <= 75)) {
            circle.addClass('yellow');
          }
          if (scope.value > 75) {
            return circle.addClass('red');
          }
        };
      }
    };
  });

}).call(this);

(function() {
  angular.module("app").directive("componentWorkerField", function() {
    return {
      restrict: 'E',
      templateUrl: "worker_field/worker_field.html",
      require: 'ngModel',
      scope: {},
      link: function(scope, elm, attrs, ngModel) {
        return ngModel.$render = function() {
          scope.last = scope.$parent.$last;
          scope.index = scope.$parent.$index;
          return scope.item = ngModel.$viewValue;
        };
      }
    };
  });

}).call(this);
