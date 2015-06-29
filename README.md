# Status Warden Scheduler

The status warden scheduler preforms and schedules the background processing required by the status warden application stack. It's main task is to preform the monitor requests.
The scheduler relies on the agenda npm package.

### Example Usage

```bash
vagrant up
```

### Current Job Functions

urlStatusCheck - Requests a url and creates a monitor event based on the response. Emails monitor owner on monitor status change.

### Configuration

| Environment Variable       | Default                        | Description                                                                        |
|----------------------------|--------------------------------|------------------------------------------------------------------------------------|
| API_ROOT_URL               | 'http://10.0.2.2:28002/'       | The root url for the status-warden-api                                             |
| DATABASE_CONNECTION_STRING | '10.0.2.2:28001/status-warden' | The status-warden-database mongodb connection string                               |
| ENVIRONMENT                | 'development'                  | The environment type. Dictates the process manager settings file                   |
| ROOT_ADMIN_DISPLAY_NAME    | 'admin'                        | The display name of the seeded root administrator user account                     |
| ROOT_ADMIN_EMAIL_ADDRESS   | 'admin@codeaim.com'            | The email address of the seeded root administrator user account                    |
| ROOT_ADMIN_PASSWORD        | 'P@ssword'                     | The password of the seeded root administrator user account                         |
| SCHEDULER_DEBUG_PORT       | 28103                          | The port on which the status-warden-scheduler debugger is listening                |
| SCHEDULER_DEBUG_WEB_PORT   | 28203                          | The port on which the status-warden-scheduler debugger web interface is listening  |

# Status Warden

Status Warden is a status monitoring service for supervising web address health. The warden monitors the status of a web address at a configurable interval and provides serviceable intelligence through email notifications and a web based dashboard.

### Features

* Periodic monitoring of web addresses
* Email notifications on status change
* Configurable monitoring interval
* Basic authentication
* REST style facade API
* Web based dashboard

### Related Links & Documents

- [Status Warden](http://www.statuswarden.com), the software as a service implementation
- The status warden model [npm package](https://www.npmjs.com/package/status-warden-model)
- Other status warden github repositories
 - [status-warden-api](https://github.com/codeaim/status-warden-api) - The status warden rest api
 - [status-warden-database](https://github.com/codeaim/status-warden-database) - The status warden mongodb database
 - [status-warden-model](https://github.com/codeaim/status-warden-model) - The status warden mongoose model
 - [status-warden-web](https://github.com/codeaim/status-warden-web) - The status warden web based dashboard
