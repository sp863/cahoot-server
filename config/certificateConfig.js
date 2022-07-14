exports.getRsaKeyOptions = () => {
  const rsaKeyOptions = {
    rsa_keygen_bits: 2048,
    format: "PKCS8",
  };

  return rsaKeyOptions;
};

exports.getCsrOptions = (name, email) => {
  const csrOptions = {
    hash: "sha256",
    days: 365,
    subject: {
      countryName: "KR",
      stateOrProvinceName: "Seoul",
      localityName: "Seoul",
      postalCode: "12345",
      streetAddress: "",
      organizationName: name,
      organizationalUnitName: name,
      commonName: ["certificatetools.com", "www.certificatetools.com"],
      emailAddress: email,
    },
  };

  return csrOptions;
};
