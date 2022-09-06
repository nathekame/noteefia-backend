// const config = require('../config/secret');

const dftTemplate = async (data) => {

// console.log('the BODY DETAIS ===> ' + JSON.stringify(data));
  // const frontendUrl = `${config.frontendUrl}:${config.nodePort}`;
  const body = ` <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="margin: 0pt auto; padding: 0px; background:#f6f6f6;">
  <table id="main" width="100%" height="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f6f6f6">
    <tbody>
      <tr>
        <td valign="top">
          <table class="innermain" cellpadding="0" width="580" cellspacing="0" border="0" bgcolor="#f6f6f6" align="center" style="margin:0 auto; table-layout: fixed;">
            <tbody>
              <!-- START of MAIL Content -->
              <tr>
                <td colspan="4">
                  <!-- Logo start here -->
                  <table class="logo" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                      <tr>
                        <td colspan="2" height="60"></td>
                      </tr>

                    </tbody>
                  </table>
                  <!-- Logo end here -->
                  <!-- Main CONTENT -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="border-radius: 0px 0px 4px 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);border-top:solid 10px #4e5152;">
                    <tbody>
                      <tr>
                        <td height="50"></td>
                      </tr>
                      <tr style="font-family: -apple-system,BlinkMacSystemFont,&#39;Segoe UI&#39;,&#39;Roboto&#39;,&#39;Oxygen&#39;,&#39;Ubuntu&#39;,&#39;Cantarell&#39;,&#39;Fira Sans&#39;,&#39;Droid Sans&#39;,&#39;Helvetica Neue&#39;,sans-serif; color:#4E5C6E; font-size:14px; line-height:20px; margin-top:20px;">
                        <td class="content" colspan="2" valign="top" align="center" style="padding-left:90px; padding-right:90px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff">
                            <tbody>
                              <tr>
                          
                              </tr>
                              <tr><td height="20" &nbsp;=""></td></tr>
                              <tr><td height="1" bgcolor="#DAE1E9"></td></tr>
                              <tr>
                                <td height="40" &nbsp;=""></td>
                              </tr>

                              <!-- addressed to -->
                              <tr>
                                <td align="left">
                                 
                                </td>
                              </tr>
                              <tr>
                                <td height="24" &nbsp;=""></td>
                              </tr>

                              <!-- Email Body -->
                              <tr>
                                <td align="left"style="color:#303030;font-size:14px;line-height:24px;">
                                ${data}
                                </td>
                              </tr>
                              <tr>
                                <td height="40" &nbsp;=""></td>
                              </tr>

                              <!-- Sign Off -->
                              <tr>
                             
                              </tr>
                              <tr>
                                
                              </tr>

                              <tr>
                                <td align="center">
                                 
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td height="60"></td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- Main CONTENT end here -->
                  <!-- FOOTER start here -->
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                      <tr>
                        <td height="10">&nbsp;</td>
                      </tr>
                      <tr>
                
                      </tr>
                      <tr>
                        <td height="50">&nbsp;</td>
                      </tr>
                    </tbody>
                  </table>
                  <!-- FOOTER end here -->
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
`;

  return body;

  // return body;
};

module.exports = dftTemplate;
