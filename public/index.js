'use strict';

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
            company: {},
            view: true
        }
    },
    mounted: function() {
        var component = this;
        fetchJson(this.$route.path).then(function(result) {
            component.employee = result;

            fetchJson('/company/' + result.Company)
                .then(function(company) {
                    component.company =company;
                });
        });
    }
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
                component: Employee,
            },
            {
                path: '*',
                redirect: '/company/list'
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
