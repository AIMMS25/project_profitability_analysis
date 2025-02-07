// Copyright (c) 2024, Craft and contributors
// For license information, please see license.txt
/* eslint-disable */
frappe.query_reports["Project Profitability Analysis"] = {
    "filters": [
        {
            'fieldname': 'project',
            'label': __("Project"),
            'fieldtype': 'Link',
            'options': 'Project',
            'on_change': function() {
                frappe.query_report.set_filter_value('task', '');
            },
        },
        {
            'fieldname': 'task',
            'label': __("Task"),
            'fieldtype': 'Link',
            'options': 'Task',
            'get_query': function() {
                var project = frappe.query_report.get_filter_value('project');
                if (project) {
                    return {
                        filters: {
                            'project': project
                        }
                    };
                }
            },
            'on_change': function() {
                var task = frappe.query_report.get_filter_value('task');
                if (task) {
                    frappe.db.get_value('Task', task, 'project', function(value) {
                        if (value && value.project) {
                            frappe.query_report.set_filter_value('project', value.project);
                        }
                    });
                }
            }
        }
    ],
    "formatter": function (value, row, column, data, default_formatter) {
        console.log(data)
        console.log(data.currency)
        if (column.fieldname === "voucher_no") {
            value = frappe.format(value, {fieldtype: 'Link', options: data.voucher_type});
        } else if(column.fieldname === "task_no"){
            value = frappe.format(value, {fieldtype: 'Link', options: 'Task'});
        } else if (column.fieldname === "qty") {
            if (value === '') {
                value = '';
            } else {
                value = parseFloat(value).toFixed(2);
            }
        } else if (column.fieldname === "rate") {
            if (value === '' || value === 0) {
                value = '';      
            } else {
                value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " " + data.currency;
            }
        } else if (column.fieldname === "amount") {
            if (value === ' ' || value === '' || value === 0) {
                value = '';
            } else if (data.is_percentage) {
                value = parseFloat(value).toFixed(2) + "%";
            } else {
                value = parseFloat(value).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}) + " " + data.currency;
            }
        } else {
            value = default_formatter(value, row, column, data);
        }
        if (data && data.indent == 0) {
            value = $(`<span>${value}</span>`);
            var $value = $(value).css("font-weight", "bold");
            value = $value.wrap("<p></p>").parent().html();
        }
        return value;
    }
};