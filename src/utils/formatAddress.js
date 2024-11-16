export const formatAddress = (address) => {
  const { houseNumber, street, barangay, municipality, province, country } =
    address;

  const addressParts = [];

  if (houseNumber) {
    addressParts.push(houseNumber);
  }
  if (street) {
    addressParts.push(street);
  }
  if (barangay) {
    addressParts.push(barangay);
  }
  if (municipality) {
    addressParts.push(municipality);
  }
  if (province) {
    addressParts.push(province);
  }
  if (country) {
    addressParts.push(country);
  }
  return addressParts.join(", ").trim();
};
