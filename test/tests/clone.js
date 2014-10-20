var assert = require("assert");
var path = require("path");
var Promise = require("promise");
var promisify = require("promisify-node");
var rimraf = promisify("rimraf");

describe("Clone", function() {
  var http = path.resolve("test/repos/http");
  var https = path.resolve("test/repos/https");
  var ssh = path.resolve("test/repos/ssh");
  var git = path.resolve("test/repos/git");
  var file = path.resolve("test/repos/file");

  var Repository = require("../../lib/repository");
  var Clone = require("../../lib/clone");

  before(function() {
    return Promise.all([
      rimraf(http),
      rimraf(https),
      rimraf(ssh),
      rimraf(git),
      rimraf(file),
    ]);
  });

  it("can clone with http", function() {
    var url = "http://github.com/nodegit/test.git";
    var opts = { ignoreCertErrors: 1 };

    return Clone.clone(url, http, opts).then(function(repository) {
      assert.ok(repository instanceof Repository);
    });
  });

  it("can clone with https", function() {
    var url = "https://github.com/nodegit/test.git";
    var opts = { ignoreCertErrors: 1 };

    return Clone.clone(url, https, opts).then(function(repository) {
      assert.ok(repository instanceof Repository);
    });
  });

  it("can clone with ssh", function() {
    var url = "git@github.com:nodegit/test.git";
    var opts = {
      ignoreCertErrors: 1,
      remoteCallbacks: {
        credentials: function() {
          console.log("here");
          return null;
        }
      }
    };

    return Clone.clone(url, ssh, opts).then(function(repository) {
      assert.ok(repository instanceof Repository);
    });
  });

  it("can clone with git", function() {
    var url = "git://github.com/nodegit/test.git";
    var opts = { ignoreCertErrors: 1 };

    return Clone.clone(url, git, opts).then(function(repository) {
      assert.ok(repository instanceof Repository);
    });
  });

  it("can clone with filesystem", function() {
    var url = "file://" + path.resolve("test/repos/empty");

    return Clone.clone(url, file).then(function(repository) {
      assert.ok(repository instanceof Repository);
    });
  });
});
