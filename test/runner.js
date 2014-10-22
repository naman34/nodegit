var promisify = require("promisify-node");
var fs = promisify("fs");
var child_process = require("child_process");

// Have to wrap exec, since it has a weird callback signature.
var exec = promisify(child_process.exec);

// Store the pageant process here so we can terminate it after testing.
var pageant;

before(function() {
  this.timeout(15000);

  var url = "https://github.com/nodegit/nodegit";

  if (process.platform === "win32") {
    pageant = exec("vendor\\pageant.exe vendor\\private.ppk");
  }

  return fs.exists("test/repos").then(function(hasRepos) {
    return fs.mkdir("test/repos").then(function() {
      return exec("git init test/repos/empty");
    }).then(function() {
      return exec("git clone " + url + " test/repos/workdir");
    }).then(function() {
      var nonrepo = "test/repos/nonrepo";

      return fs.mkdir(nonrepo).then(function() {
        return fs.writeFile(nonrepo + "/file.txt", "This is a bogus file");
      });
    });
  }).catch(function() {});
});
