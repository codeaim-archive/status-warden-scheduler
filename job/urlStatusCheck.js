var request = require('request');
var model = require('status-warden-model');

var config = require('../config.js');
var log = require('../logger.js');

module.exports = function(job, done) {
    log.info("Url status check: Started for monitor " + job.attrs.monitor);
    request({ method: 'GET', uri: config.API_ROOT_URL + "auth/token?email=" + config.ROOT_ADMIN_EMAIL_ADDRESS + "&password=" + config.ROOT_ADMIN_PASSWORD, json: true }, function(err, res, token) {
        if (err) {
            job.fail(err);
            job.save();
            log.error(err);
            return done();
        }

        log.info("Url status check: Recieved token " + token.token + " for monitor " + job.attrs.monitor);

        request({ method: 'GET', uri: config.API_ROOT_URL + "monitor/" + job.attrs.monitor, headers: { 'Authorization': token.token }, json: true }, function(err, res, monitor) {
            if (err) {
                job.fail(err);
                job.save();
                log.error(err);
                return done();
            }

            log.info("Url status check: Recieved monitor " + monitor.name);

            return checkMonitorStatus(token.token, monitor, false, job, done);
		});
    });
}

function checkMonitorStatus(token, monitor, isConfirmingStatus, job, done) {
    log.info("Url status check: Head requesting monitor url " + monitor.url);
    request({ method: 'HEAD', uri: monitor.url, time: true, timeout: 8000 }, function(err, res) {
        if (err) {
            job.fail(err);
            job.save();
            log.error(err);
            return done();
        }

        var currentStatus = res.statusCode < 400 ? "Up" : "Down";

        log.info("Url status check: Head request complete, monitor status " + monitor.status);

        var monitorEvent = new model.MonitorEvent({
            confirmed: isConfirmingStatus,
            monitor: monitor._id,
            responseTime: res.elapsedTime,
            status: currentStatus,
            statusCode: res.statusCode,
            user: monitor.user
        });

        request({ method: 'POST', uri: config.API_ROOT_URL + "monitorEvent", headers: { 'Authorization': token }, json: true, body: monitorEvent._doc }, function(err, res) {
            if (err) {
                job.fail(err);
                job.save();
                log.error(err);
                return done();
            }

            if(currentStatus != monitor.status && !isConfirmingStatus) {
                log.info("Url status check: Confirming monitor status");
                monitor.status = currentStatus;
                return checkMonitorStatus(token, monitor, true, job, done);
            }

            if(currentStatus == monitor.status && isConfirmingStatus) {
                log.info("Url status check: Updating monitor");
                monitor.status = currentStatus;
                return updateMonitor(token, monitor, job, done);
            }

            return done();
        });
    });
}

function updateMonitor(token, monitor, job, done) {
    request({ method: 'PUT', uri: config.API_ROOT_URL + "monitor/" + monitor._id, headers: { 'Authorization': token }, json: true, body: monitor }, function(err, res) {
        if (err) {
            job.fail(err);
            job.save();
            log.error(err);
            return done();
        }

        request({ method: 'GET', uri: config.API_ROOT_URL + "user/" + monitor.user, headers: { 'Authorization': token }, json: true }, function(err, res, user) {
            if (err) {
                job.fail(err);
                job.save();
                log.error(err);
                return done();
            }

            log.info('Monitor owner ' + user.displayName   + ' sent notification email to ' + user.emailAddress + ' regarding ' + monitor.status + ' status for monitor ' + monitor._id);
            return done();
        });
    });
}
