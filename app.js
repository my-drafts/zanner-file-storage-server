#!/usr/bin/env node

var swig = require('swig');
var tpl = new swig.Swig({
	cache: false,
	locals:{},
	loader: swig.loaders.fs('./template', {encoding: 'utf8'})
});

var mach = require('mach');
var app = mach.stack();
app.use(mach.logger);
app.use(mach.modified);
app.use(mach.params);

app.get('/template/*', function(conn){
	return mach.file({
		root: __dirname,
		autoIndex: false,
		useLastModified: true,
		useETag: true
	})(conn);
});

app.get('/storage/*', function(conn){
	return mach.file({
		root: __dirname,
		autoIndex: false,
		useLastModified: true,
		useETag: true
	})(conn);
});

app.get('/', function(conn){
	return new Promise(function(resolve, reject){
		tpl.renderFile('default/index.html', {}, function(error, out){
			if(error) reject(error)
			else resolve(out);
		});
	});
});

mach.serve(app, {port: 8081});