frappe.ui.form.on("Project", {
    refresh: function(frm) {
        if (frm.doc.name) {
            frappe.call({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Purchase Order",
                    filters: {
                        project: frm.doc.name,
                        status: ["!=", "Cancelled"] 
                    }, 
                    fields: ["grand_total"], 
                },
                callback: function(response) {
                    if (response.message) {
                        let total_amount = response.message.reduce((sum, po) => sum + po.grand_total, 0);
                        frm.set_value("custom_total_purchase_amount", total_amount);
                    }
                }
            });
        }
    }
});
