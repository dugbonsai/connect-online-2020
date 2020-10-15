function OnUpdate(doc, meta) {
    if (meta.id.startsWith("_sync") == true) {
      return;
    }

    if (meta.id.startsWith("user::")) {
        if (doc.type == "user") {
            // See the following URL for details when both the Sync Gateway & Eventing are leveraging the same bucket
            // https://docs.couchbase.com/server/current/eventing/eventing-language-constructs.html#crc64_call

            var prev_crc = checksum["crc::" + meta.id];
            var curr_crc = crc64(doc);

            if (prev_crc == curr_crc) {
              return;
            }

            checksum["crc::" + meta.id] = curr_crc;

            log('Sending email to ', doc.email);
            var request = {
                // Generate request as per your email provider's document
                // Twilio Sendgrid was used in the Connect.ONLINE demo
                headers: {
                    'Authorization': // Your Authorization details,
                    'Content-Type': 'application/json'
                },
                body: '{"personalizations":[{"to":[{"email":"' + doc.email + '"}]}],"from":{"email":"dwbonser@mac.com"},"subject":"Your profile has been updated","content":[{"type":"text/html","value":"<b>Name:</b> ' + doc.name + '<br><b>Address:</b> ' + doc.address + '<br><b>University: </b>' + doc.university + '"}]}',
                path: '/v3/mail/send'
            };

            var response = curl('POST', emailAPI, request);
            log('response', response.status);
        }
    }
}

function OnDelete(meta, options) {
}
