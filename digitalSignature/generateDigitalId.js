const node_openssl = require("node-openssl-cert");
const openssl = new node_openssl();
const { writeFileSync } = require("fs");
const {
  getRsaKeyOptions,
  getCsrOptions,
} = require("../config/certificateConfig");

exports.generateDigitalID = async () => {
  console.log("generating digital ID");
  const rsaKeyOptions = getRsaKeyOptions();
  const csrOptions = getCsrOptions("Scott", "test@test.com");

  openssl.generateRSAPrivateKey(rsaKeyOptions, (error, key) => {
    if (error) {
      console.log(error);
    } else {
      openssl.generateCSR(
        csrOptions,
        key,
        "none",
        (error, certificateRequest) => {
          if (error) {
            console.log(error);
          } else {
            openssl.selfSignCSR(
              certificateRequest,
              csrOptions,
              key,
              "none",
              (error, certificate) => {
                if (error) {
                  console.log(error);
                } else {
                  openssl.createPKCS12(
                    certificate,
                    key,
                    "none",
                    false,
                    "",
                    (error, keyStore) => {
                      if (error) {
                        console.log(error);
                      } else {
                        writeFileSync("signature-keystore.p12", keyStore);
                      }
                    },
                  );
                }
              },
            );
          }
        },
      );
    }
  });
};
