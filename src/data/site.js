export const site = {
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m22!1m8!1m3!1d3984.20780118723!2d101.74628347497074!3d3.038879646936964!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d3.0388401999999997!2d101.74874369999999!4m5!1s0x31cc3543def799d1%3A0x4badda68a84593da!2skmc63trading!3m2!1d3.0389174!2d101.74887129999999!5e0!3m2!1sen!2smy!4v1717744066121!5m2!1sen!2smy",
  name: 'KMC 63 Trading',
  phone: '+60 16-358 5326',
  phoneLink: '+60163585326',
  email: 'kmc63trading@gmail.com',
  address: 'No.1, Jalan Com Industrial Park 2/1, Com Industrial Park 2, Kawasan Perindustrian Kg. Baru Balakong, 43300 Seri Kembangan, Selangor, Malaysia.',
  map: 'https://www.google.com/maps/search/?api=1&query=KMC+63+Trading+Balakong'
};
export const links = [['Home', '/'], ['About', '/aboutUs'], ['Services', '/Services'], ['Products', '/Products']];
export const whatsapp = (context = '') => `https://wa.me/60163585326?text=${encodeURIComponent(`Hi KMC, I would like to enquire about ${context || 'your baking trays and coating services'}.`)}`;
