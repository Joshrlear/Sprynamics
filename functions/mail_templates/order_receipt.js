module.exports = function (order) {
  return `
    <table style="margin-bottom: 1.5rem; background-color: #fff; box-shadow: 0 0.25rem 0.125rem 0 rgba(0,0,0,.05); border-radius: .25rem; font-family: 'Helvetica'; max-width:600px; max-height:800px; border: 1px solid #eee" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">
        <tr>
            <td align="center" valign="top">
                <table border="0" cellpadding="0" cellspacing="0" id="emailContainer">
                    <tr>
                        <td align="center" valign="top">
                            <table border="0" cellpadding="24" cellspacing="0" width="100%" id="emailHeader">
                                <tr>
                                    <td align="left" valign="top">
                                        <img src="assets/logo.png" width="180" alt="sprynamics">
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top">
                            <table border="0" cellpadding="24" cellspacing="0" width="100%" id="emailBody">
                                <tr>
                                    <td align="left" valign="top">
                                        Hey, ${order.firstName}. 
                                        <br><br>
                                        We'd like to thank you for choosing Sprynamics. Your payment overview is below.
                                    </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="top">
                                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                      <tr>
                                        <td align="left" valign="top">
                                          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 264px;">
                                            <tr>
                                              <td align="left" valign="top" style="padding-bottom: 8px;">
                                                <img src="http://via.placeholder.com/120x120" alt="">
                                              </td>
                                            </tr>
                                            <tr>
                                              <td id="product-title" align="left" valign="top">
                                                <span style="color:#34383e; font-size: 14px; font-weight: 500;">Sprynamics ${order.product}</span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td id="product-qty" align="left" valign="top">
                                                <span style="color:#34383e; font-size: 14px; font-weight: 500;">Qty:</span> <span style="font-size: 14px; color: #666;">${order.quantity}</span>
                                              </td>
                                            </tr>
                                            <hr>
                                            <tr>
                                              <td align="left" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                                  <tr id="subtotal">
                                                    <td align="left" valign="top">
                                                      <span style="color:#34383e; font-size: 14px; font-weight: 500;">Subtotal:</span>
                                                    </td>
                                                    <td align="right" valign="top">
                                                      <span style="font-size: 14px; color: #36cc7b;">$${order.subtotal}</span>
                                                    </td>
                                                  </tr>
                                                  <tr id="shipping">
                                                    <td align="left" valign="top">
                                                      <span style="color:#34383e; font-size: 14px; font-weight: 500;">Shipping & Handling:</span>
                                                    </td>
                                                    <td align="right" valign="top">
                                                      <span style="font-size: 14px; color: #36cc7b;">$${order.shippingCost}</span>
                                                    </td>
                                                  </tr>
                                                  <tr id="tax">
                                                    <td align="left" valign="top">
                                                      <span style="color:#34383e; font-size: 14px; font-weight: 500;">Tax:</span>
                                                    </td>
                                                    <td align="right" valign="top">
                                                      <span style="font-size: 14px; color: #36cc7b;">$2.99</span>
                                                    </td>
                                                  </tr>
                                                  <tr id="total">
                                                    <td align="left" valign="top">
                                                      <span style="color:#34383e; font-size: 14px; font-weight: 500;">Total:</span>
                                                    </td>
                                                    <td align="right" valign="top">
                                                      <span style="font-size: 14px; color: #36cc7b;">$${order.total}</span>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                        <td align="right" valign="top">
                                          <table border="0" cellpadding="12" cellspacing="0" width="100%" style="max-width: 220px; background-color: #f1f1f1;">
                                            <tr>
                                              <td align="left" valign="top" style="background-color: #34383e;">
                                                <span style="color: #fff; font-weight: 500; font-size: 14px;">SHIP TO:</span>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="left" valign="top">
                                                <span style="color: #666; font-size: 12px;">${order.shipping.firstName} ${order.shipping.lastName}
                                                  <br>
                                                  <a href="">${order.shipping.address1} ${order.shipping.address2}</a> 
                                                  <br>
                                                  <a href="">${order.shipping.city},</a> <a href="">${order.shipping.state}</a> <a href="">${order.shipping.zipCode}</a><a href=""></a> 
                                                </span>
                                              </td>
                                            </tr>
                                            <hr style="margin-top: .1rem; margin-bottom: .1rem;">
                                            <tr>
                                              <td align="left" valign="top">
                                                <span style="color:#34383e; font-size: 14px; font-weight: 500;">Shipping Method:</span>
                                                <br>
                                                <span style="color: #666; font-size: 12px;">UPS Ground</span>
                                              </td>
                                            </tr>
                                            <hr style="margin-top: .1rem; margin-bottom: .1rem;">
                                            <tr>
                                              <td align="left" valign="top">
                                                <span style="color:#34383e; font-size: 14px; font-weight: 500;">Order Number:</span>
                                                <br>
                                                <span style="color: #36cc7b; font-size: 12px;">${order.id}</span>
                                              </td>
                                            </tr>
                                            <hr style="margin-top: .1rem; margin-bottom: .1rem;">
                                            <tr>
                                              <td align="left" valign="top">
                                                <span style="color:#34383e; font-size: 14px; font-weight: 500;">Order Date:</span>
                                                <br>
                                                <span style="color: #36cc7b; font-size: 12px;">${order.createdAt}</span>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                      
                                      </table>
                                  </td>

                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" valign="top">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" id="emailFooter" style="margin-top: 32px;">
                                <tr>
                                    <td align="center" valign="top" style="background-color: #34383e; padding: 15px 30px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                          <tr>
                                            <td align="left" valign="top">
                                              <a href="" style="color: #fff; font-size: 12px;">Contact Us</a>
                                            </td>
                                            <td align="right" valign="top">
                                              <span style="color: #fff; font-size: 12px;">© 2018 Sprynamics. All Rights Reserved.</span>
                                            </td>
                                          </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                  <td align="left" valign="top" style="padding: 20px 30px;">
                                    <span style="color: #666; font-size: 12px;">Sprynamics. 1-25 Concord St, Lawrence, MA 01840</span>
                                    <br>
                                    <span style="color: #666; font-size: 12px;">Please do not reply to this email. If you need to contact Sprynamics please</span> <a href="" style="font-size: 12px;">click here</a>
                                  </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
  `;
}