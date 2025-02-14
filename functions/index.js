const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const express = require("express");
const cors = require("cors");
const Razorpay = require('razorpay');
const axios = require('axios');
const bodyParser = require('body-parser'); // Optional, if using form data

const app = express();
const PORT = 3000;


const RAZORPAY_KEY_ID = 'rzp_test_rUx3Ufu3PNuJy8';  // Replace with your Razorpay Test Key
 const RAZORPAY_KEY_SECRET = 'Tc6gQZj26kZjmebqM5obBvrT';   // Replace with your Razorpay Secret Key


const razorpay = new Razorpay({
  key_id: 'rzp_test_rUx3Ufu3PNuJy8',
  key_secret: 'Tc6gQZj26kZjmebqM5obBvrT'
});

app.use(cors({ origin: 'http://localhost:4200' }));
//app.use(cors({ origin: 'https://aarioushashion.web.app' }));



// Middleware to parse JSON request bodies
app.use(express.json()); // For parsing application/json

// Middleware to parse URL-encoded bodies (if you're using form data)
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded




app.post("/send-email", async (req, res) => {
  const {
     sendto, 
    text,
     username, 
     productname,
    orderdate,
    deliverydate,
    orderid,
    addresline1,
    addresline2,
    area,
    dist,
    city,
    state,
    pincode,
    amount,
    registredNo

 } = req.body;




 //console.log("Send email to "+sendto);
 

 const emailSubject = "Your Order for "+productname+" has been successfully placed";

 orderBody = "<!DOCTYPE html><html lang='en'><div style=\"margin:0;padding:0\" bgcolor=\"#F0F0F0\" marginwidth=\"0\" marginheight=\"0\">\r\n"
 + "  <img style=\"width:1px;height:1px\" src=\"https://ci6.googleusercontent.com/proxy/cUkDek64Pi1hPvX4MoEzIbkwOi0oVoDhdSRA89oMiuwvHayQl4IUfPKGiNLTNG4GeUIlJAFAS-5spR60qVQax5hl-YyrkiqpJCc8iUCoXEkM4ntmCldnAZfhiSfD2LrqVmQ5v1Pj5roSNvx0DPyJrDVW9PrMx3h0G7Py1NzyLM1Uk0M603KLPFgnP-SvFUjka_4iLrkH1h04pYTlEG20tf9A7su2EuIpRJ6Q36ceErSOwEdudZQwrN-WUh9DWWudbzZjCzBPIPdD7AaXOYb4yVSEKwbpPwMreIVnRaV96FAjvGU6TGopPRqWeZp1L-M4uwaleXplJiFhHqzWjEpo06lKeMTqOaRRJQy22EKSMM2ZTo-Veij58bWQJHufIG9p5edFvgl5kUHsoXMWGarbUoP0QPKcbSFpqXVUH5XY_qkg1T192bcAAvx2Z-wucnG1M5l1UzRvAXpE-3wPxN04fsWXPSs=s0-d-e1-ft#http://l.flipkart.com/t/open/Pqt5dGC5tS9HKrZzbsZoVAu3WbqOMkSdYvecqZJWRC_zQ-aZ8k--XxGyxPJrmss4LRw1xL_sa9Et0F4NB--sRLN8DVwtLJIy2Jjg3tmi-CSx6NmpZYB-2d09-b57zK3NXXOyqqSAEi8X5VrqKGPI23dhd-EwnIF7wsHrQJj-etu-r_hw9ENf-x1NNl6S5WoW64TuBqUi2Xc9C3S875AEoI7JbHR76r754AXOwiT7zb8wvCpJW-3mG_iM76MsQdtcF9KohHN2yxvgfp82a61p5Wm2GJlbSM_oB15LFpsLl88=?e=true\" class=\"CToWUd\"> \r\n"
 + "  <table style=\"width:100%!important\">\r\n"
 + "   <tbody>\r\n"
 + "    <tr background=\"https://ci6.googleusercontent.com/proxy/YMt6_ARlAWKkFVC24bx0s3rzOrQwkaaLgM-fjuLL_mWOZIy_xITYDT688_Nq7ehc1Yu0rKpUul2GFf8jHwOMjYNZ-XL-x6eL41axsTdca5XL5k1-jAMT0Hh3fCsss89fl0DKCwz5ABoZhNfPplsmn5w96KMaHoNGoFOC-48=s0-d-e1-ft#https://rukminim1.flixcart.com/www/834/60/promos/28/08/2017/de0c263a-65a0-4f4b-b141-5062917b7d9b.png?q=100\" width=\"834px\" height=\"60\">\r\n"
 + "     <td>\r\n"
 + "      <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" height=\"60\" style=\"width:600px!important;text-align:center;margin:0 auto\">\r\n"
 + "       <tbody>\r\n"
 + "        <tr>\r\n"
 + "         <td>\r\n"
 + "          <table style=\"width:640px;max-width:640px;padding-right:20px;padding-left:20px\">\r\n"
 + "           <tbody>\r\n"
 + "            <tr>\r\n"
 + "             <td style=\"width:40%;text-align:left;padding-top:5px\"><a style=\"text-decoration:none;outline:none;color:#ffffff;font-size:13px\" href=\"http://delivery.nct.flipkart.com/QRFNSEO?id=88656=ehkDAAoOVwYCTFBTVgIBXQICCAIBBAMEUwMHBQECW1QNVQBVVlMAUQZVBwNXDFpbV1pFVAdXBwAEVwQPUVdQAwgBVlFWBVBSBQkNXFMHWQkGBVpWA1BWBgIAAEsFBFYFAVQBAgUFVgsMCQBSU0hQTUYTAxoaUABeW0cERU0cDVRNS1VcW0YKUkZEGgYMWRdoYCV3ZnB7WltWTRcE&amp;fl=URFHQAgZTl8aVlgME19ZS0ZNWlpYGxEdUV0IVF8dClhsAUF8fWAUB1ZRVhwlTFBDQisOVnt/MHpbBABgRAMKUkAWfmVIXi9lUR1CPSAMDk9bDkN9cF4yZGYIL3UGWTNNcFVRQmRyK2J5RWsjEVx+aQYlcgZQRjJHf2YVcn5fU3RoHHZGXW8jW1wHByAGWmt+XjR+fG9eLHwLdw9NTHcyWHAsVVlxVS0HXwdMJhtxQWt4CENQQWVUYXx1UARzATpyCC9eR1lUUnB2X0c6KWsIWn82TkFfUFBHZ3IKRFdgAkJLXWdIRGwJdkdaXiorQkJRdA5UBGxxLwZzHDAAe2IaAnZdAFF8VytHW0JTIxIZcQ54AhRMUmtXZVtfC29HeSFtewhKBEt7LWMEcwQ/KwcAUkRScHFjbhAHaFwFRH5tO0RVBlp8ZHFWeAxGeD0nARVwcyxUbHQMFn0BawIAWnoKZggnWntwRVcDYHZFVCxBC3ZhW29+bUYDfkRVUmdwAiZfDy0HZV97IwNsW3gIK3dWXl8rDQVGBS1gUWYxeV9QBwBYE1oEVW8na1FfdxYvZg96alVAZXt/H357RThGcUcXRQoSdXxYUxQGcFN9FFNOU3h/B3ZieVk8HwZbA35ceQ==&amp;ext=ZT10cnVl\" target=\"_blank\" data-saferedirecturl=\"https://www.google.com/url?q=http://delivery.nct.flipkart.com/QRFNSEO?id%3D88656%3DehkDAAoOVwYCTFBTVgIBXQICCAIBBAMEUwMHBQECW1QNVQBVVlMAUQZVBwNXDFpbV1pFVAdXBwAEVwQPUVdQAwgBVlFWBVBSBQkNXFMHWQkGBVpWA1BWBgIAAEsFBFYFAVQBAgUFVgsMCQBSU0hQTUYTAxoaUABeW0cERU0cDVRNS1VcW0YKUkZEGgYMWRdoYCV3ZnB7WltWTRcE%26fl%3DURFHQAgZTl8aVlgME19ZS0ZNWlpYGxEdUV0IVF8dClhsAUF8fWAUB1ZRVhwlTFBDQisOVnt/MHpbBABgRAMKUkAWfmVIXi9lUR1CPSAMDk9bDkN9cF4yZGYIL3UGWTNNcFVRQmRyK2J5RWsjEVx%2BaQYlcgZQRjJHf2YVcn5fU3RoHHZGXW8jW1wHByAGWmt%2BXjR%2BfG9eLHwLdw9NTHcyWHAsVVlxVS0HXwdMJhtxQWt4CENQQWVUYXx1UARzATpyCC9eR1lUUnB2X0c6KWsIWn82TkFfUFBHZ3IKRFdgAkJLXWdIRGwJdkdaXiorQkJRdA5UBGxxLwZzHDAAe2IaAnZdAFF8VytHW0JTIxIZcQ54AhRMUmtXZVtfC29HeSFtewhKBEt7LWMEcwQ/KwcAUkRScHFjbhAHaFwFRH5tO0RVBlp8ZHFWeAxGeD0nARVwcyxUbHQMFn0BawIAWnoKZggnWntwRVcDYHZFVCxBC3ZhW29%2BbUYDfkRVUmdwAiZfDy0HZV97IwNsW3gIK3dWXl8rDQVGBS1gUWYxeV9QBwBYE1oEVW8na1FfdxYvZg96alVAZXt/H357RThGcUcXRQoSdXxYUxQGcFN9FFNOU3h/B3ZieVk8HwZbA35ceQ%3D%3D%26ext%3DZT10cnVl&amp;source=gmail&amp;ust=1653833840297000&amp;usg=AOvVaw3OfMea5zXoiO8zKdYfUAWo\">My Kart</a></td>\r\n"
 + "             <td style=\"width:60%;text-align:right;padding-top:5px\"><p style=\"color:rgba(255,255,255,0.8);font-family:Arial;font-size:16px;text-align:right;color:#ffffff;font-style:normal;font-stretch:normal\">Order <span style=\"font-weight:bold\">Placed</span></p></td>\r\n"
 + "            </tr>\r\n"
 + "           </tbody>\r\n"
 + "          </table></td>\r\n"
 + "        </tr>\r\n"
 + "       </tbody>\r\n"
 + "      </table></td>\r\n"
 + "    </tr>\r\n"
 + "    <tr>\r\n"
 + "     <td>\r\n"
 + "      <table border=\"0\" width=\"100%\" height=\"100%\" cellpadding=\"0\" cellspacing=\"0\" bgcolor=\"#f5f5f5\">\r\n"
 + "       <tbody>\r\n"
 + "        <tr>\r\n"
 + "         <td align=\"center\" valign=\"top\" bgcolor=\"#f5f5f5\">\r\n"
 + "          <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"width:640px;max-width:640px;padding-right:20px;padding-left:20px;background-color:#fff;padding-top:20px\">\r\n"
 + "           <tbody>\r\n"
 + "            <tr>\r\n"
 + "             <td class=\"m_-1267630119282308content\" align=\"left\">\r\n"
 + "              <table width=\"350\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"left\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr>\r\n"
 + "                 <td class=\"m_-1267630119282308col\" valign=\"top\"><p style=\"font-family:Arial;color:#878787;font-size:12px;font-weight:normal;font-style:normal;font-stretch:normal;margin-top:0px;line-height:14px;padding-top:0px;margin-bottom:7px\">Hi <span style=\"font-weight:bold;color:#191919\"> "+username+",</span>  </p><p style=\"font-family:Arial;font-size:12px;color:#878787;line-height:14px;padding-top:0px;margin-top:0px;margin-bottom:7px\">Your order has been successfully placed.</p></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table>\r\n"
 + "              <table width=\"250\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"right\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr>\r\n"
 + "                 <td class=\"m_-1267630119282308col\" valign=\"top\"><p style=\"font-family:Arial;color:#747474;font-size:11px;font-weight:normal;text-align:right;font-style:normal;line-height:14px;font-stretch:normal;margin-top:0px;padding-top:0px;color:#878787;margin-bottom:7px\">Ordered on <span style=\"font-weight:bold;color:#000\">"+orderdate+"</span></p><p style=\"font-family:Arial;font-size:11px;color:#878787;line-height:14px;text-align:right;padding-top:0px;margin-top:0;margin-bottom:7px\">Order ID <span style=\"font-weight:bold;color:#000\">"+orderid+"</span></p></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table></td>\r\n"
 + "            </tr>\r\n"
 + "            <tr>\r\n"
 + "             <td align=\"left\">\r\n"
 + "             \r\n"
 + "             \r\n"
 + "			  </td>\r\n"
 + "            </tr>\r\n"
 + "            <tr>\r\n"
 + "             <td class=\"m_-1267630119282308content\" border=\"1\" align=\"left\" style=\"background-color:rgba(245,245,245,0.5);background:rgba(245,245,245,0.5);border:.5px solid #6ed49e;border-radius:2px;padding-top:20px;padding-bottom:20px;border-color:#6ed49e;border-width:.08em;border-style:solid;border:.08em solid #6ed49e\">\r\n"
 + "              <table width=\"360\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"left\" style=\"margin-bottom:20px;padding-left:15px\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr>\r\n"
 + "                 <td class=\"m_-1267630119282308col\" valign=\"top\"><img src=\"https://ci4.googleusercontent.com/proxy/kEYhoZr5WYwGswGbrtaies_zHFOqa0MI5U5JbfgopQ4XZ3Y3XDIqWK9yRA78HEHDt13SwQuRLud6Z7uuLey8cxXrkv-twYGZbuXTdXTJgJDKvo-nvt4vU4dJ9i8JN1B1NOMRexJjN5-F3EVuicWmhmjhbW6piY1or5uRopM=s0-d-e1-ft#https://rukminim1.flixcart.com/www/270/28/promos/07/03/2018/f0e74e39-2481-4e34-b8f6-d2ab80ac15fe.png?q=100\" alt=\"journey\" style=\"margin-bottom:20px\" class=\"CToWUd\"><p style=\"font-family:Arial;font-size:12px;line-height:1.42;color:#212121;margin-top:0px;margin-bottom:20px\"><span style=\"display:inline-block;width:125px;vertical-align:top\"> Delivery </span><span style=\"font-family:Arial;font-size:12px;font-weight:bold;line-height:1.42;color:#139b3b;display:inline-block;width:220px\">by "+deliverydate+"</span> <span style=\"display:block;font-family:Arial;font-size:10px;color:#878787;margin-top:4px\">Please refer to items list for delivery time of individual items </span> </p> <p style=\"font-family:Arial;font-size:12px;line-height:1.42;color:#212121;margin-bottom:20px;margin-top:0px\"><span style=\"display:inline-block;width:125px;min-width:125px;max-width:125px\">Amount Payable</span><span style=\"font-family:Arial;font-size:12px;font-weight:bold;line-height:1.42;color:#139b3b;display:inline-block;width:220px\">Rs. "+amount+"</span></p> <p style=\"margin-bottom:0px;margin-top:0\"><a href=\"https://myshop-d60a1.web.app/userorder\" style=\"background-color:rgb(41,121,251);color:#fff;padding:0px;border:0px;font-size:14px;display:inline-block;margin-top:0px;border-radius:2px;text-decoration:none;width:160px;text-align:center;line-height:32px;line-height:32px\" target=\"_blank\" data-saferedirecturl=\"https://www.google.com/url?q=http://delivery.nct.flipkart.com/QRFNSEO?id%3D88656%3DehkDAAoOVwYCTFAABwQID1RQWgxTBQcLVAZUBgULUFVdBlAEAA9VUFdVUVxbUAkJUABFVAdXBwAEVwQPUVdQAwgBVlFWBVBSBQkNXFMHWQkGBVpWA1BWBgIAAEsFBFYFAVQBAgUFVgsMCQBSU0hQTUYTAxoaUABeW0cERU0cDVRNS1VcW0YKUkZEGgYMWRdoYCV3ZnB7WltWTRcE%26fl%3DURFHQAgZTl8aVlgME19ZS0ZNWlpYGxEdUV0IVF8dMQZxNnReVGw5Y1F2TQY8VkFYQS1/UAZ6LV9qc1hdQHs7VndTfVlLYQtAR3FlMFZ6TE5ELGBRT3k3H1p9J1NQAQBbcwhjXmpHGVV9VF4WLXFZbV5OD0ZSWDV0a2sOQ0x7KEMLJkdjZVslbEYDYi0hBlFMaxEMeWdHCllXeQNkWGEKRFhId2F4UhNkfARyXTdXbnNbOl5kYHYNYHBfKHUAABIOcCF6X1FuAkNAVnUHGQxeWmECCl5ZdlV%2BdwMPXVB2CkF0OgYAX2MVWHF/ZjM1fH5vXwlWDGEBHwVUfFlmfgAoX2ABYR1CAgNlAHFQXU4EWlQCIGhMWwMNAXFEKgdkdCxEUixpSFRTD3VOUnoAWgR9eAEmAAICW1ZXegA%2BdHwCOnJRDkJRdW8DckJGRlwbU0prQVBufnJbMHQGcD4Ae0cJAFNURXpFQRdiZ0JVCCtZFW4CE35YVH4dXnMFDl4FAARoSVJUXmQOBnJsalsSAEdVXWorXnhvYiNLSkEiXEADE3UNNXwHfUUEZ3tdUAgTTFsMcRlcVmV2XAJ4UgJ0ZH9bcXImfwJjDyxReVNdIFFkSgBUDHN9dwAhBGRXCkBFAC1waFAKe2gHDXJ9ZAFSNgJITmAVckJDBQJRYQUvZVpzEEdIVnhpZmxVUH1aBCEOTV9gVVNccAFWBwcLczZSUWMzBAkOVkpDcglGRAddNwFTUn1KLlgCUnNXRnQELXxhUDB%2Bfj1nAV5BC0Z7fX4EC2QLekMEW3RFTDAFX3kgbWt9%26ext%3DZT10cnVl&amp;source=gmail&amp;ust=1653833840297000&amp;usg=AOvVaw3xzyZiwbYCZqABKYxoFE0k\">Manage Your Order</a></p> </td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table>\r\n"
 + "              <table width=\"225\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"right\" style=\"margin-bottom:30px;padding-right:15px\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr>\r\n"
 + "                 <td class=\"m_-1267630119282308col\" valign=\"top\" align=\"left\">\r\n"
 + "                  <div style=\"max-width:220px;padding-top:0px;margin-bottom:20px\">\r\n"
 + "                   <p style=\"font-family:Arial;font-size:14px;font-weight:bold;line-height:20px;color:#212121;margin-top:0px;margin-bottom:4px\">Delivery Address</p>\r\n"
 + "                   <p style=\"font-family:Arial;font-size:12px;line-height:1.42;color:#212121;margin-top:0px;margin-bottom:0\"> "+username+"<br> <span style=\"font-family:Arial;font-size:12px;line-height:1.42;color:#212121\"> "+addresline1+" "+addresline2+"<br> "+area+" "+dist+"<br>"+city+" "+state+" "+pincode+"</span></p>\r\n"
 + "                  </div><p style=\"line-height:1.56;margin-top:0;margin-bottom:0\"><span style=\"font-family:Arial;font-size:14px;font-weight:bold;text-align:left;color:#212121;display:block;line-height:20px;margin-bottom:4px\">SMS updates sent to</span><span style=\"font-family:Arial;font-size:12px;color:#212121\">"+registredNo+"</span></p></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table> \r\n"
 + "              <table width=\"600\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" align=\"left\" style=\"padding-left:15px;padding-right:15px\">\r\n"
 + "              \r\n"
 + "              </table></td>\r\n"
 + "            </tr>\r\n"
 + "            <tr> \r\n"
 + "             <td></td>\r\n"
 + "            </tr>\r\n"
 + "            <tr>\r\n"
 + "             \r\n"
 + "            </tr>\r\n"
 + "            <tr>\r\n"
 + "            \r\n"
 + "            </tr>\r\n"
 + "            <tr>\r\n"
 + "             <td align=\"left\">\r\n"
 + "              <table width=\"100%\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" style=\"margin-top:0px\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr>\r\n"
 + "                 <td height=\"1\" style=\"background-color:#f0f0f0;font-size:0px;line-height:0px\" bgcolor=\"#f0f0f0\"></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table></td>\r\n"
 + "            </tr>\r\n"
 + "           </tbody>\r\n"
 + "          </table> \r\n"
 + "       \r\n"
 + "          <table border=\"0\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" class=\"m_-1267630119282308container\" style=\"padding-right:20px;padding-left:20px;background-color:#fff;width:642px;max-width:642px\"> \r\n"
 + "           <tbody>\r\n"
 + "            <tr>\r\n"
 + "             <td align=\"left\">\r\n"
 + "              <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin:0;max-width:600px;background:#ffffff\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr style=\"color:#212121;display:block;margin:0 auto;clear:both\">\r\n"
 + "                 <td align=\"left\" valign=\"top\" class=\"m_-1267630119282308container\" style=\"color:#212121;display:block\">\r\n"
 + "                  <table width=\"100%\" style=\"margin-bottom:0px;padding-top:20px;padding-bottom:20px;border-bottom:1px solid #f0f0f0\"> \r\n"
 + "                   <tbody>\r\n"
 + "                   </tbody>\r\n"
 + "                  </table></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table></td>\r\n"
 + "            </tr>\r\n"
 + "           </tbody>\r\n"
 + "          </table> \r\n"
 + "          <table border=\"0\" width=\"600\" cellpadding=\"0\" cellspacing=\"0\" class=\"m_-1267630119282308container\" style=\"padding-right:20px;padding-left:20px;background-color:#fff;width:640px;max-width:640px\">\r\n"
 + "           <tbody>\r\n"
 + "            <tr>\r\n"
 + "             <td>\r\n"
 + "              <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:600px;max-width:600px;background:#ffffff\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr class=\"m_-1267630119282308col\" style=\"color:#212121\">\r\n"
 + "                 <td align=\"left\" valign=\"top\" class=\"m_-1267630119282308container\" style=\"color:#212121;border-bottom:1px solid #f0f0f0\"><p style=\"font-family:Arial;font-size:14px;font-weight:bold;line-height:1.86;color:#212121\">Thank you for shopping with Us</p><p style=\"font-family:Arial;font-size:12px;color:#212121;margin-bottom:5px\" class=\"m_-1267630119282308link\"> Got Questions? Please get in touch with our <a href=\"http://delivery.nct.flipkart.com/QRFNSEO?id=88656=ehkDAAoOVwYCTAwAUgQMWAtVAVNRAVcCAgFTBlVXVgFbVlZUAlAAAVVTAgRbVwEBAQZFVAdXBwAEVwQPUVdQAwgBVlFWBVBSBQkNXFMHWQkGBVpWA1BWBgIAAEsFBFYFAVQBAgUFVgsMCQBSU0hQTUYTAxoaUABeW0cERU0cDVRNS1VcW0YKUkZEGgYMWRdoYCV3ZnB7WltWTRcE&amp;fl=URFHQAgZTl8aVlgME19ZS0ZNWlpYGxEdUV0IVF8dClhsAUF8fWAUB1ZRVhwlTFBDQisOYnN8JwZWXDhQfgoIU3EoVklLQzlqdWRxVwkADQF0DXFCfFMweWJ9F3NYeDNlfxFyenhBLVVfQ2ApB2diXVQSa3BhfidYBHgIUlEHFWh8NFFIAVJTd15HDVQHfX9VcAkJAGpsAUZccjgERwQHUFscVUcEWBd2UWV5XBV6DGtCE2lWUF4dWGhuUgJzeRtWcFVeUlt7FVdCfwMfFkZ0C1wLUHF6clJIWnNZXURBF2hmMwJHcw8sXn1UDRMycAlQAQFfVmxuVWBoSC5DcFktX2MTBXFFf1JrA0FgCA9QdnVqJg5ce24gBB9LA3ABAy5bdVRlUmtwUl52RQQCC0drQAQEfxhlZwZha2QHUnddJ2FmAXJIW2MTcHhSBiQ6WnVfVQkATFx8D19+fhZiV39QYEEDYlloZDgKTANdMVdxewxCKQlgeF46em1DDmhkBQlwXRVwRGp4V0pZAAw3OX9aCVlOXGNWBT9YAUgoZnl8AVl+PGxicVgwakVzejIyQ05OHw1UVwd+AgpxYTlBQAUFcQtTVUpGaQ9kc15yBjpDUQxLE2BtGFpSS2ZaLgNeUQthYDd6e1YbTGNkZUYtVl5/QV4ObEIICQ==&amp;ext=ZT10cnVl\" style=\"color:#2175ff\" target=\"_blank\" data-saferedirecturl=\"https://www.google.com/url?q=http://delivery.nct.flipkart.com/QRFNSEO?id%3D88656%3DehkDAAoOVwYCTAwAUgQMWAtVAVNRAVcCAgFTBlVXVgFbVlZUAlAAAVVTAgRbVwEBAQZFVAdXBwAEVwQPUVdQAwgBVlFWBVBSBQkNXFMHWQkGBVpWA1BWBgIAAEsFBFYFAVQBAgUFVgsMCQBSU0hQTUYTAxoaUABeW0cERU0cDVRNS1VcW0YKUkZEGgYMWRdoYCV3ZnB7WltWTRcE%26fl%3DURFHQAgZTl8aVlgME19ZS0ZNWlpYGxEdUV0IVF8dClhsAUF8fWAUB1ZRVhwlTFBDQisOYnN8JwZWXDhQfgoIU3EoVklLQzlqdWRxVwkADQF0DXFCfFMweWJ9F3NYeDNlfxFyenhBLVVfQ2ApB2diXVQSa3BhfidYBHgIUlEHFWh8NFFIAVJTd15HDVQHfX9VcAkJAGpsAUZccjgERwQHUFscVUcEWBd2UWV5XBV6DGtCE2lWUF4dWGhuUgJzeRtWcFVeUlt7FVdCfwMfFkZ0C1wLUHF6clJIWnNZXURBF2hmMwJHcw8sXn1UDRMycAlQAQFfVmxuVWBoSC5DcFktX2MTBXFFf1JrA0FgCA9QdnVqJg5ce24gBB9LA3ABAy5bdVRlUmtwUl52RQQCC0drQAQEfxhlZwZha2QHUnddJ2FmAXJIW2MTcHhSBiQ6WnVfVQkATFx8D19%2BfhZiV39QYEEDYlloZDgKTANdMVdxewxCKQlgeF46em1DDmhkBQlwXRVwRGp4V0pZAAw3OX9aCVlOXGNWBT9YAUgoZnl8AVl%2BPGxicVgwakVzejIyQ05OHw1UVwd%2BAgpxYTlBQAUFcQtTVUpGaQ9kc15yBjpDUQxLE2BtGFpSS2ZaLgNeUQthYDd6e1YbTGNkZUYtVl5/QV4ObEIICQ%3D%3D%26ext%3DZT10cnVl&amp;source=gmail&amp;ust=1653833840298000&amp;usg=AOvVaw2zCaGZx63aHkcYuP9cVd1C\">24x7 Customer Care</a></p><br></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table></td>\r\n"
 + "            </tr>\r\n"
 + "            <tr>\r\n"
 + "             <td>\r\n"
 + "              <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"width:600px;max-width:600px;margin-top:14px\">\r\n"
 + "               <tbody>\r\n"
 + "                <tr>\r\n"
 + "                 <td align=\"left\" valign=\"top\" class=\"m_-1267630119282308container\" style=\"color:#2c2c2c;line-height:20px;font-weight:300;background-color:transparent\">\r\n"
 + "                  <table>\r\n"
 + "                  \r\n"
 + "                  </table></td>\r\n"
 + "                </tr>\r\n"
 + "                <tr>\r\n"
 + "                 <td>\r\n"
 + "                  <table width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" style=\"margin:0 auto;width:600px;max-width:600px;margin-top:4px\">\r\n"
 + "                   <tbody>\r\n"
 + "                    <tr>\r\n"
 + "                     <td align=\"left\" valign=\"top\" class=\"m_-1267630119282308container\" style=\"color:#2c2c2c;line-height:20px;font-weight:300;background-color:transparent\">\r\n"
 + "                      <table>\r\n"
 + "                       <tbody>\r\n"
 + "                        <tr>\r\n"
 + "                         <td><p style=\"font-family:Arial;font-size:10px;color:#878787\">This email was sent from a notification-only address that cannot accept incoming email. Please do not reply to this message.</p></td>\r\n"
 + "                        </tr>\r\n"
 + "                       </tbody>\r\n"
 + "                      </table></td>\r\n"
 + "                    </tr>\r\n"
 + "                   </tbody>\r\n"
 + "                  </table></td>\r\n"
 + "                </tr>\r\n"
 + "               </tbody>\r\n"
 + "              </table></td>\r\n"
 + "            </tr>\r\n"
 + "           </tbody>\r\n"
 + "          </table></td>\r\n"
 + "        </tr>\r\n"
 + "       </tbody>\r\n"
 + "      </table></td>\r\n"
 + "    </tr>\r\n"
 + "   </tbody>\r\n"
 + "  </table>\r\n"
 + "  \r\n"
 + "  \r\n"
 + " <p>&nbsp;<br></p>\r\n"
 + "<img src=\"https://ci3.googleusercontent.com/proxy/lfcsTk9KUep7eQcMqkkpFz3tayBQQdWsBaZtLuP11MNnDxQRv3dqzxBJUSRDbzLyYGLN2dobYyIMzih_QlB4ZPlZXwsJlN4zAWp09txVEKFNK78r2pG4qT-ltcJtgUul3qyXpQPaZCkvZqyH_q_HxbJek-ha5tFIMmiWxgjWyIJ5rtOnBDHa1aLk0hdVxRGdlD8YzvaPVDdVJ_l7vtY6y-TgKhW7D0evtIBSMrsW5dIyMOLyrYIJuVltBj2-m7SrYMbMUzIYBPWUp47Ixv1uzQAxiANkP-HAgDntPZwyVPF7V3E7sqACN61r15ZK7xGqEp2gDH4RzoZZ9jHX6nxoqCN97W__avFpOBMdhHHHVnvSjNsZkLA=s0-d-e1-ft#http://delivery.nct.flipkart.com/QRFNSEO?id=88656=dhkDAAoOVwYCTBRFQxQYGRJDGRUVFEUSEhFBFxQSQxcZRRMQEhZBExQQFEVDFBgZElNFVAdXBwAEVwQPUVdQAwgBVlFWBVBSBQkNXFMHWQkGBVpWA1BWBgIAAEsFBFYFAVQBAgUFVgsMCQBSU0hQTUYTAxoaUABeW0cERU0cDVRNS1VcW0YKUkZEGgYMWRdoYCV3ZnB7WltWTRcE\" alt=\"\" class=\"CToWUd\"></div></html>"
 
 

  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "yourshoopingcart@gmail.com", // Replace with your email
      pass: "agrl ekbu jpno atoi", // Replace with your email app password
    },
  });

  const mailOptions = {
    from: "yourshoopingcart@gmail.com",
    to: sendto,
    subject: emailSubject,
    text,
    html : orderBody,
  };

  app.use(express.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded (optional, if using form data)

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully", info });
    console.log("Email sent successfully")
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error });
  }
});

app.post('/create-order', async (req, res) => {
  const options = {
    amount: 500, // amount in paise
    currency: 'INR',
    receipt: 'order_rcptid_11'
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post('/verify-payment', async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', 'Tc6gQZj26kZjmebqM5obBvrT');
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === razorpay_signature) {
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid payment signature' });
  }
});




app.post('/pay', async (req, res) => {
  try {
    const { amount, card } = req.body;

    // Print API credentials before making a request
console.log("🔹 Razorpay Key ID:", RAZORPAY_KEY_ID);
console.log("🔹 Razorpay Secret:", RAZORPAY_KEY_SECRET);

    if (!amount || !card || !card.number || !card.expiry_month || !card.expiry_year || !card.cvv) {
      return res.status(400).json({ error: "Missing required payment fields" });
    }

    

    // Create a Razorpay payment request
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    console.log("🔹 authHeader:", authHeader);

    const response = await axios.post(
      'https://api.razorpay.com/v1/payments',
      {
        amount: amount,  // Amount in paise (e.g., ₹2 = 200)
        currency: "INR",
        method: "card",
        card: {
          number: card.number.replace(/\s/g, ''),  // Remove spaces from card number
          expiry_month: card.expiry_month,
          expiry_year: card.expiry_year,
          cvv: card.cvv,
          name: card.name
        }
      },
      {
        headers: {
          "Authorization": authHeader,  // 🔥 Use Base64 encoded auth
          "Content-Type": "application/json"
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Payment Failed:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : "Payment failed" });
  }
});








// Export the app as a Firebase Function
//exports.api = functions.https.onRequest(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });

 
