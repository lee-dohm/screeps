"use strict"

var exec = require('child_process').execSync

function getCurrentBranch() {
  return exec('git branch --show-current')
}

module.exports = function(grunt) {
  var config = require('./.screeps.json')

  var currentBranch = getCurrentBranch()
  var branch = grunt.option('branch') || config.branch
  var email = grunt.option('email') || config.email
  var password = grunt.option('password') || config.password
  var ptr = grunt.option('ptr') ? true : config.ptr

  grunt.loadNpmTasks('grunt-screeps');

  grunt.initConfig({
    screeps: {
      options: {
        email: email,
        password: password,
        branch: branch,
        ptr: ptr
      },
      dist: {
        src: ['dist/*.js']
      }
    }
  });
}
