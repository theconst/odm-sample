'use strict';

var Greeting = Vue.component('greeting', {
    template: '#greeting'
});

var Cell = Vue.component('cell', {
    template: '#cell',
    props: {
        value: {},
        type: {
            default: "text",
            type: String
        },
        throttle: {
            default: 500,
            type: Number
        },
        debounce: {
            default: 100,
            type: Number
        },
        readonly: {
            type: Boolean,
            default: true
        }
    },
    data: function() {
        return {
            freezed: this.readonly
        }
    },
    computed: {
        debounceEmit: function() {
            return _.debounce(_.throttle(function(event) {
                this.$emit('input', event.target.value);
            }, this.throttle).bind(this), this.debounce);
        }
    },
    methods: {
        unfreeze: function() {
            this.freezed = false;
        },
        freeze: function() {
            this.freezed = true;
        }
    }
});

var Companies = Vue.component('companies-list', {
    template: '#companies-list-template',
    data: function() {
        return {
            companies: []
        };
    },
    mounted: function() {
        var component = this;
        fetchJson(this.$route.path).then(sortByName)
            .then(function(sortedByName) {
                component.companies = sortedByName;
            });
    }
});

var Employees = Vue.component('employees-list', {
    template: '#employees-list-template',
    data: function() {
        return {
            employees: []
        };
    },
    mounted: function() {
        var component = this;
        fetchJson(this.$route.path).then(sortByName)
            .then(function(sortedByName){
                component.employees = sortedByName;
            });
    }
});

var Employee = Vue.component('employee-details', {
    template: '#employee-template',
    data: function() {
        return {
            employee: {},
            company: {}
        }
    },
    mounted: function() {
        var component = this;

        ['Name', 'Title', 'Notes', 'Salary', 'Office_City'].forEach(function(v) {
            var n = 'employee.' + v;
            component.$watch(n, createEmployeeWatcher.bind(component)(n));
        });

        fetchJson(this.$route.path).then(function(result) {
            component.employee = result;

            fetchJson('/company/' + result.Company)
                .then(function(company) {
                    component.company =company;
                });
        });

    },
});

var app = new Vue({ 
    el: '#app',
    router: new VueRouter({
        routes: [
            {
                path: '/company/list',
                component: Companies
            },
            {
                path: '/company/:id/employees',
                component: Employees
            },
            {
                path: '/employee/:id',
                component: Employee
            },
            {
                path: '/',
                component: Greeting
            },
            {
                path: '*',
                redirect: '/'
            }
        ]
    })
});

function sortByName(arr) {
    return arr.sort((a, b) => a.Name.localeCompare(b.Name));
}

function fetchJson(path) {
    return fetch(path)
        .then(function(res) {
            return res.json();
        });
}

function createEmployeeWatcher(name) {
    const self = this;
    return function(value, oldValue) {
        if (value === oldValue) {
            return;
        }

        fetch('/employee/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "ID": self.employee.ID,
                [name]: value
            })
        });
        // TODO(kko): catch errors
    };
}