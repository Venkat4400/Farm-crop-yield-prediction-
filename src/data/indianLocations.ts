// Indian States with their Districts/Villages
export const indianStates = [
  { code: "AP", name: "Andhra Pradesh", lat: 15.9129, lon: 79.74 },
  { code: "AR", name: "Arunachal Pradesh", lat: 28.218, lon: 94.7278 },
  { code: "AS", name: "Assam", lat: 26.2006, lon: 92.9376 },
  { code: "BR", name: "Bihar", lat: 25.0961, lon: 85.3131 },
  { code: "CG", name: "Chhattisgarh", lat: 21.2787, lon: 81.8661 },
  { code: "GA", name: "Goa", lat: 15.2993, lon: 74.124 },
  { code: "GJ", name: "Gujarat", lat: 22.2587, lon: 71.1924 },
  { code: "HR", name: "Haryana", lat: 29.0588, lon: 76.0856 },
  { code: "HP", name: "Himachal Pradesh", lat: 31.1048, lon: 77.1734 },
  { code: "JH", name: "Jharkhand", lat: 23.6102, lon: 85.2799 },
  { code: "KA", name: "Karnataka", lat: 15.3173, lon: 75.7139 },
  { code: "KL", name: "Kerala", lat: 10.8505, lon: 76.2711 },
  { code: "MP", name: "Madhya Pradesh", lat: 22.9734, lon: 78.6569 },
  { code: "MH", name: "Maharashtra", lat: 19.7515, lon: 75.7139 },
  { code: "MN", name: "Manipur", lat: 24.6637, lon: 93.9063 },
  { code: "ML", name: "Meghalaya", lat: 25.467, lon: 91.3662 },
  { code: "MZ", name: "Mizoram", lat: 23.1645, lon: 92.9376 },
  { code: "NL", name: "Nagaland", lat: 26.1584, lon: 94.5624 },
  { code: "OD", name: "Odisha", lat: 20.9517, lon: 85.0985 },
  { code: "PB", name: "Punjab", lat: 31.1471, lon: 75.3412 },
  { code: "RJ", name: "Rajasthan", lat: 27.0238, lon: 74.2179 },
  { code: "SK", name: "Sikkim", lat: 27.533, lon: 88.5122 },
  { code: "TN", name: "Tamil Nadu", lat: 11.1271, lon: 78.6569 },
  { code: "TS", name: "Telangana", lat: 18.1124, lon: 79.0193 },
  { code: "TR", name: "Tripura", lat: 23.9408, lon: 91.9882 },
  { code: "UP", name: "Uttar Pradesh", lat: 26.8467, lon: 80.9462 },
  { code: "UK", name: "Uttarakhand", lat: 30.0668, lon: 79.0193 },
  { code: "WB", name: "West Bengal", lat: 22.9868, lon: 87.855 },
  { code: "DL", name: "Delhi", lat: 28.7041, lon: 77.1025 },
  { code: "JK", name: "Jammu & Kashmir", lat: 33.7782, lon: 76.5762 },
  { code: "LA", name: "Ladakh", lat: 34.1526, lon: 77.5771 },
];

// Districts for each state (sample major districts)
export const stateDistricts: Record<string, string[]> = {
  "AP": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "YSR Kadapa"],
  "AR": ["Anjaw", "Changlang", "East Kameng", "East Siang", "Lohit", "Lower Subansiri", "Papum Pare", "Tawang", "Tirap", "Upper Siang", "West Kameng", "West Siang"],
  "AS": ["Baksa", "Barpeta", "Bongaigaon", "Cachar", "Darrang", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Jorhat", "Kamrup", "Karbi Anglong", "Kokrajhar", "Lakhimpur", "Nagaon", "Sivasagar", "Sonitpur", "Tinsukia"],
  "BR": ["Araria", "Aurangabad", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Jamui", "Katihar", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Patna", "Purnia", "Rohtas", "Samastipur", "Saran", "Vaishali"],
  "CG": ["Bastar", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Janjgir-Champa", "Jashpur", "Kanker", "Kawardha", "Korba", "Koriya", "Mahasamund", "Raigarh", "Raipur", "Rajnandgaon", "Surguja"],
  "GA": ["North Goa", "South Goa"],
  "GJ": ["Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar", "Dahod", "Gandhinagar", "Jamnagar", "Junagadh", "Kutch", "Mehsana", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Vadodara", "Valsad"],
  "HR": ["Ambala", "Bhiwani", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "HP": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "JH": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "KA": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "KL": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "MP": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "MH": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "MN": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "ML": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "MZ": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "NL": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "OD": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "PB": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Mohali", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar", "Tarn Taran"],
  "RJ": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "SK": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "TN": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "TS": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem Asifabad", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal-Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "TR": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "UP": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "UK": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "WB": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "DL": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "JK": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "LA": ["Kargil", "Leh"],
};

// Comprehensive villages for each district (major villages/towns/mandals)
export const districtVillages: Record<string, string[]> = {
  // ===== ANDHRA PRADESH =====
  "Anantapur": ["Anantapur", "Dharmavaram", "Hindupur", "Kadiri", "Guntakal", "Tadipatri", "Rayadurg", "Gooty", "Penukonda", "Kalyandurg", "Pamidi", "Uravakonda", "Bathalapalli", "Kanekal", "Kudair", "Madakasira", "Bukkapatnam", "Garladinne", "Nallamada", "Raptadu"],
  "Chittoor": ["Chittoor", "Tirupati", "Madanapalle", "Punganur", "Nagari", "Puttur", "Srikalahasti", "Palamaner", "Pileru", "Piler", "Kuppam", "Bangarupalem", "Renigunta", "Chandragiri", "Pakala", "Thavanampalle", "Irala", "Vayalpad", "Peddapanjani", "Kalikiri"],
  "East Godavari": ["Kakinada", "Rajahmundry", "Amalapuram", "Samalkot", "Peddapuram", "Mandapeta", "Ramachandrapuram", "Tuni", "Pithapuram", "Mummidivaram", "Kothapeta", "Ravulapalem", "Alamuru", "Gollaprolu", "Jaggampeta", "Anaparthi", "Korukonda", "Razole", "Sakhinetipalli", "Kadiam"],
  "Guntur": ["Guntur", "Tenali", "Mangalagiri", "Narasaraopet", "Chilakaluripet", "Bapatla", "Vinukonda", "Macherla", "Sattenapalle", "Ponnur", "Repalle", "Piduguralla", "Prathipadu", "Gurazala", "Dachepalli", "Phirangipuram", "Bollapalli", "Muppalla", "Chebrolu", "Tadikonda"],
  "Krishna": ["Vijayawada", "Machilipatnam", "Gudivada", "Nuzvid", "Jaggaiahpet", "Nandigama", "Tiruvuru", "Pedana", "Vuyyuru", "Gannavaram", "Mylavaram", "Avanigadda", "Kaikaluru", "Movva", "Pamidimukkala", "Bantumilli", "Chandarlapadu", "Kankipadu", "Penamaluru", "Unguturu"],
  "Kurnool": ["Kurnool", "Nandyal", "Adoni", "Yemmiganur", "Dhone", "Allagadda", "Nandikotkur", "Atmakur", "Pattikonda", "Kodumur", "Mantralayam", "Kosigi", "Gudur", "Banaganapalle", "Orvakal", "Peapally", "Velgodu", "Srisailam", "Midthur", "Jupadu Bungalow"],
  "Nellore": ["Nellore", "Gudur", "Kavali", "Atmakur", "Venkatagiri", "Sullurpeta", "Sarvepalli", "Naidupeta", "Buchireddipalem", "Kovur", "Udayagiri", "Podalakur", "Marripadu", "Allur", "Bogole", "Muthukur", "Rapur", "Sangam", "Vinjamur", "Kaluvoya"],
  "Prakasam": ["Ongole", "Chirala", "Markapur", "Kandukur", "Giddalur", "Chimakurthy", "Addanki", "Darsi", "Podili", "Kanigiri", "Yerragondapalem", "Bestavaripeta", "Cumbum", "Singarayakonda", "Pamuru", "Santhanuthalapadu", "Tallur", "Voletivaripalem", "Mundlamuru", "Marturu"],
  "Srikakulam": ["Srikakulam", "Palakonda", "Narasannapeta", "Tekkali", "Amadalavalasa", "Rajam", "Ichchapuram", "Palasa", "Ponduru", "Sompeta", "Gara", "Polaki", "Kanchili", "Ranastalam", "Saravakota", "Laveru", "Jalumuru", "Pathapatnam", "Veeraghattam", "Hiramandalam"],
  "Visakhapatnam": ["Visakhapatnam", "Anakapalli", "Bheemunipatnam", "Narsipatnam", "Yelamanchili", "Chodavaram", "Araku", "Paderu", "Pendurthi", "Gajuwaka", "Payakaraopeta", "Makavarapalem", "Koyyuru", "Madugula", "Munagapaka", "Rambilli", "Golugonda", "Butchayyapeta", "Denkada", "Nakkapalli"],
  "Vizianagaram": ["Vizianagaram", "Parvathipuram", "Bobbili", "Salur", "Rajam", "Nellimarla", "Srungavarapukota", "Cheepurupalli", "Garividi", "Dattirajeru", "Pusapatirega", "Komarada", "Merakamudidam", "Jiyyammavalasa", "Gummalakshmipuram", "Bondapalli", "Gajapathinagaram", "Bhogapuram", "Badangi", "Therlam"],
  "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem", "Tanuku", "Narasapuram", "Palakol", "Kovvur", "Jangareddigudem", "Chintalapudi", "Akividu", "Nidadavolu", "Palakollu", "Attili", "Penugonda", "Gopalapuram", "Undi", "Iragavaram", "Denduluru", "Dwarakatirumala", "Poduru"],
  "YSR Kadapa": ["Kadapa", "Proddatur", "Pulivendla", "Rajampet", "Jammalamadugu", "Badvel", "Mydukur", "Rayachoti", "Kamalapuram", "Yerraguntla", "Lakkireddypalli", "Pendlimarri", "Vempalli", "Kondapuram", "Brahmamgari Matham", "Porumamilla", "Vontimitta", "Simhadripuram", "Khajipeta", "Vallur"],

  // ===== TELANGANA =====
  "Hyderabad": ["Hyderabad", "Secunderabad", "Kukatpally", "L.B. Nagar", "Uppal", "Quthbullapur", "Serilingampally", "Malkajgiri", "Kapra", "Musheerabad", "Khairatabad", "Charminar", "Golconda", "Bahadurpura", "Bandlaguda", "Rajendranagar", "Mehdipatnam", "Ameerpet", "Begumpet", "Banjara Hills"],
  "Rangareddy": ["Shamshabad", "Ibrahimpatnam", "Maheshwaram", "Chevella", "Moinabad", "Rajendranagar", "Shadnagar", "Kandukur", "Kothur", "Farooqnagar", "Yacharam", "Manchal", "Hayathnagar", "Ghatkesar", "Keesara", "Malkajgiri", "Medchal", "Shankarpalli", "Pargi", "Nawabpet"],
  "Warangal Urban": ["Warangal", "Kazipet", "Hanamkonda", "Madikonda", "Subedari", "Waddepally", "Desaipet", "Shayampet", "Bheemadevarapally", "Kamalapur", "Elkathurthi", "Dharmasagar", "Inavolu", "Atmakur", "Chennaraopet", "Hasanparthy", "Oorugonda", "Parvathagiri", "Thorrur", "Geesugonda"],
  "Warangal Rural": ["Narsampet", "Parkal", "Sangem", "Duggondi", "Khanapur", "Wardhannapet", "Atmakur", "Mogullapally", "Damera", "Pakhala", "Rayaparthi", "Nalla Belli", "Zaffergadh", "Nekkonda", "Lingalagunti", "Guduru", "Shayampeta", "Narayanaraopeta", "Dharmasagar", "Narsampet"],
  "Karimnagar": ["Karimnagar", "Huzurabad", "Jammikunta", "Choppadandi", "Koratla", "Jagtial", "Metpally", "Sircilla", "Vemulawada", "Manakondur", "Gangadhara", "Sultanabad", "Koheda", "Thimmapur", "Ramadugu", "Shankarapatnam", "Elgandal", "Saidapur", "Chigurumamidi", "Kothapalli"],
  "Khammam": ["Khammam", "Kothagudem", "Bhadrachalam", "Madhira", "Sathupalli", "Palvancha", "Yellandu", "Enkuru", "Mudigonda", "Wyra", "Thirumalayapalem", "Kusumanchi", "Vemsoor", "Raghunadhapalem", "Chintakani", "Nelakondapalli", "Khammam Rural", "Thallada", "Singareni", "Tekulapalli"],
  "Nizamabad": ["Nizamabad", "Bodhan", "Armoor", "Kamareddy", "Banswada", "Yellareddy", "Balkonda", "Domakonda", "Dichpally", "Nandipet", "Varni", "Kotagiri", "Lingampet", "Velpur", "Ranjal", "Tadwai", "Navipet", "Mortad", "Jakranpalli", "Gandhari"],
  "Nalgonda": ["Nalgonda", "Miryalaguda", "Suryapet", "Bhongir", "Devarakonda", "Nakrekal", "Huzurnagar", "Kodad", "Chityala", "Yadagirigutta", "Thungathurthi", "Ramannapet", "Nagarjunasagar", "Chandampeta", "Neredcherla", "Chintapalli", "Nuthankal", "Tripuraram", "Mothkur", "Peddavoora"],
  "Medak": ["Sangareddy", "Siddipet", "Zaheerabad", "Narayankhed", "Medak", "Narsapur", "Toopran", "Gajwel", "Patancheru", "Ramayampet", "Sadasivpet", "Andole", "Jogipet", "Kondapur", "Hathnoora", "Shankarampet", "Regode", "Chinnakodur", "Kohir", "Manoharabad"],
  "Mahabubnagar": ["Mahabubnagar", "Jadcherla", "Shadnagar", "Gadwal", "Narayanpet", "Wanaparthy", "Atmakur", "Achampet", "Kollapur", "Alampur", "Kothakota", "Devarkadra", "Koilkonda", "Balanagar", "Bhoothpur", "Makthal", "Gopalpet", "Kosgi", "Dhanwada", "Pangal"],
  "Adilabad": ["Adilabad", "Mancherial", "Nirmal", "Bhainsa", "Bellampalli", "Asifabad", "Utnoor", "Luxettipet", "Chennur", "Sirpur", "Jainad", "Boath", "Tamsi", "Gudihatnur", "Narsapur", "Ichoda", "Jannaram", "Koutala", "Mudhole", "Tanur"],

  // ===== BIHAR =====
  "Patna": ["Patna", "Danapur", "Phulwari Sharif", "Khagaul", "Fatuha", "Mokama", "Barh", "Bihta", "Masaurhi", "Paliganj", "Bakhtiarpur", "Maner", "Naubatpur", "Punpun", "Pandarak", "Dulhin Bazar", "Bikram", "Dhanarua", "Athmalgola", "Belchhi"],
  "Gaya": ["Gaya", "Bodh Gaya", "Sherghati", "Manpur", "Tekari", "Wazirganj", "Fatehpur", "Guraru", "Barachatti", "Khizersarai", "Dobhi", "Belaganj", "Paraiya", "Tankuppa", "Banke Bazar", "Amas", "Dumaria", "Muhra", "Gurua", "Mohanpur"],
  "Muzaffarpur": ["Muzaffarpur", "Kanti", "Motipur", "Saraiya", "Paroo", "Gaighat", "Bandra", "Kurhani", "Marwan", "Minapur", "Bochahan", "Sahebganj", "Aurai", "Katra", "Muraul", "Baruraj", "Sakra", "Dholi", "Mushahari", "Ahiapur"],
  "Begusarai": ["Begusarai", "Barauni", "Teghra", "Bachhwara", "Bakhri", "Ballia", "Bhagwanpur", "Birpur", "Cheria Bariarpur", "Dandari", "Garhpura", "Khudabandpur", "Mansurchak", "Matihani", "Naokothi", "Sahebpur Kamal", "Samho Akha Kurha", "Shamho", "Balia"],

  // ===== UTTAR PRADESH =====
  "Lucknow": ["Lucknow", "Mohanlalganj", "Bakshi Ka Talab", "Malihabad", "Chinhat", "Kakori", "Gosainganj", "Sarojini Nagar", "Itaunja", "Mall", "Nagram", "Bijnaur", "Sidhauli", "Nigoha", "Behta", "Rae Bareli Road", "Hardoi Road", "Amausi", "Banthra", "Mohan Road"],
  "Varanasi": ["Varanasi", "Ramnagar", "Pindra", "Cholapur", "Kashi Vidyapeeth", "Harahua", "Sevapuri", "Arazilines", "Baragaon", "Chiraigaon", "Badagaon", "Gangapur", "Karkhiyaon", "Mirkhampur", "Suriyawan", "Phoolpur", "Kasara", "Raja Talab", "Sarnath", "Shivpur"],
  "Agra": ["Agra", "Fatehabad", "Etmadpur", "Kheragarh", "Fatehpur Sikri", "Bah", "Kiraoli", "Jagner", "Shamsabad", "Barauli Ahir", "Achhnera", "Jaitpur Kalan", "Shamshabad", "Pinahat", "Saiyan", "Akola", "Bichpuri", "Kakura", "Dayal Bagh", "Nunhai"],
  "Meerut": ["Meerut", "Modipuram", "Sardhana", "Mawana", "Parikshitgarh", "Daurala", "Jani", "Hastinapur", "Machhra", "Rajpura", "Behsuma", "Kharkhauda", "Rohta", "Baghpat", "Sakauti", "Kithore", "Salawa", "Phalda", "Sisona", "Nangla Pal"],
  "Kanpur": ["Kanpur", "Sarsaul", "Bilhaur", "Ghatampur", "Chaubepur", "Akbarpur", "Bhitargaon", "Sanigawan", "Rasulabad", "Kalyanpur", "Bithoor", "Kakwan", "Derapur", "Jhinjhak", "Bhaupur", "Shivrajpur", "Pukhrayan", "Bhognipur", "Patara", "Mahrajpur"],
  "Allahabad": ["Prayagraj", "Naini", "Phulpur", "Handia", "Meja", "Karchhana", "Soraon", "Koraon", "Pratappur", "Shankargarh", "Bara", "Kaurihar", "Mau", "Holagarh", "Saidabad", "Chaka", "Bahria", "Uruwan", "Jhunsi", "Nawabganj"],
  "Gorakhpur": ["Gorakhpur", "Khorabar", "Sahjanwa", "Khajni", "Bansgaon", "Campierganj", "Chauri Chaura", "Pipraich", "Bhatahat", "Chargawan", "Belghat", "Uruwa Bazar", "Sardarnagar", "Brahmpur", "Kuri Bhawar", "Gola", "Mundera Bazar", "Jangal Kaudia", "Pali", "Peppeganj"],

  // ===== MAHARASHTRA =====
  "Pune": ["Pune", "Pimpri-Chinchwad", "Baramati", "Daund", "Indapur", "Junnar", "Khed", "Maval", "Mulshi", "Shirur", "Velhe", "Bhor", "Purandar", "Haveli", "Ambegaon", "Talegaon Dabhade", "Lonavala", "Rajgurunagar", "Vadgaon Maval", "Manchar"],
  "Nagpur": ["Nagpur", "Kamptee", "Hingna", "Saoner", "Umred", "Kuhi", "Bhiwapur", "Mouda", "Katol", "Narkhed", "Parseoni", "Ramtek", "Mauda", "Kalmeshwar", "Kalamb", "Kaalmeshwar", "Tarasa", "Pandhurna", "Mohapa", "Ashti"],
  "Nashik": ["Nashik", "Trimbakeshwar", "Igatpuri", "Sinnar", "Niphad", "Dindori", "Manmad", "Surgana", "Kalwan", "Deola", "Satana", "Malegaon", "Nandgaon", "Yeola", "Chandwad", "Baglan", "Peth", "Harsul", "Ozar", "Ghoti"],
  "Ahmednagar": ["Ahmednagar", "Rahuri", "Sangamner", "Shrirampur", "Kopargaon", "Shevgaon", "Pathardi", "Parner", "Nagar", "Akole", "Jamkhed", "Karjat", "Shrigonda", "Newasa", "Rahata", "Bhingar", "Belapur", "Sonai", "Wadgaon Gupta", "Takali Dhokeshwar"],
  "Solapur": ["Solapur", "Pandharpur", "Barshi", "Akkalkot", "Sangola", "Mangalwedha", "Mohol", "Malshiras", "Madha", "Karmala", "North Solapur", "South Solapur", "Kurduwadi", "Akluj", "Maindargi", "Nannaj", "Velapur", "Pangaon", "Dahigaon", "Malinagar"],
  "Kolhapur": ["Kolhapur", "Ichalkaranji", "Karvir", "Panhala", "Shahuwadi", "Kagal", "Hatkanangale", "Shirol", "Radhanagari", "Bhudargad", "Ajara", "Gadhinglaj", "Chandgad", "Bavda", "Gagan Bawda", "Jaysingpur", "Rukadi", "Malkapur", "Jaisingpur", "Warananagar"],
  "Aurangabad": ["Aurangabad", "Khuldabad", "Kannad", "Phulambri", "Sillod", "Soegaon", "Vaijapur", "Gangapur", "Paithan", "Waluj", "Bidkin", "Chitegaon", "Lasur Station", "Daulatabad", "Golegaon", "Ajanta", "Deulgaon Raja", "Bhiknur", "Wadwani", "Ellora"],

  // ===== KARNATAKA =====
  "Bengaluru Urban": ["Bengaluru", "Yelahanka", "Byatarayanapura", "Dasarahalli", "Mahadevapura", "Bommanahalli", "Anekal", "Electronic City", "Whitefield", "Hebbal", "K R Puram", "Marathahalli", "Bellandur", "Sarjapur", "Bannerghatta", "Begur", "Bilekahalli", "Jigani", "Bidadi", "Kengeri"],
  "Mysuru": ["Mysuru", "Nanjangud", "T. Narasipura", "Hunsur", "Periyapatna", "K.R. Nagar", "H.D. Kote", "Sargur", "Piriyapatna", "Heggadadevankote", "Bannur", "Varuna", "Chamundeshwari", "Krishnarajanagara", "Nanjanagudu", "Jayapura", "Kadakola", "Bogadi", "Suttur", "Talakad"],
  "Belagavi": ["Belagavi", "Khanapur", "Gokak", "Ramdurg", "Saundatti", "Raybag", "Athani", "Bailhongal", "Chikodi", "Hukkeri", "Mudalgi", "Nippani", "Kagwad", "Kudachi", "Ugar", "Kokatnur", "Ramadurg", "Kittur", "Savadatti", "Parasgad"],

  // ===== RAJASTHAN =====
  "Jaipur": ["Jaipur", "Sanganer", "Shahpura", "Chomu", "Amber", "Jamwa Ramgarh", "Kotputli", "Phulera", "Bassi", "Chaksu", "Dudu", "Viratnagar", "Phagi", "Sambhar", "Kishangarh Renwal", "Govindgarh", "Madhorajpura", "Lalara", "Jhotwara", "Achrol"],
  "Jodhpur": ["Jodhpur", "Phalodi", "Bilara", "Pipar City", "Luni", "Mandore", "Bhopalgarh", "Shergarh", "Osian", "Balesar", "Bap", "Bawadi", "Dechu", "Phalodi", "Tinwari", "Aau", "Khejarla", "Mathania", "Salawas", "Setrawa"],
  "Udaipur": ["Udaipur", "Mavli", "Salumber", "Kherwara", "Gogunda", "Jhadol", "Kotra", "Dhariyawad", "Girwa", "Vallabhnagar", "Bhinder", "Amet", "Kurabar", "Lasadiya", "Sarada", "Rishabdeo", "Badgaon", "Kanore", "Semari", "Debari"],
  "Kota": ["Kota", "Ramganj Mandi", "Sangod", "Ladpura", "Pipalda", "Kanwas", "Digod", "Itawa", "Sultanpur", "Santha", "Kaithoon", "Simliya", "Chechat", "Mandana", "Borkhera", "Rampura", "Kunhari", "Dadwara", "Morak", "Nanta"],

  // ===== TAMIL NADU =====
  "Chennai": ["Chennai", "Tiruvottiyur", "Manali", "Madhavaram", "Ambattur", "Avadi", "Poonamallee", "Porur", "Alandur", "Guindy", "Velachery", "Sholinganallur", "Perungudi", "Adyar", "Mylapore", "Royapettah", "Nungambakkam", "T Nagar", "Kodambakkam", "Vadapalani"],
  "Coimbatore": ["Coimbatore", "Pollachi", "Mettupalayam", "Valparai", "Kinathukadavu", "Sulur", "Annur", "Karamadai", "Perur", "Thondamuthur", "Madukkarai", "Anaimalai", "Marudamalai", "Vadavalli", "Singanallur", "Peelamedu", "Ganapathy", "Ondipudur", "Kovaipudur", "Saravanampatti"],
  "Madurai": ["Madurai", "Thirumangalam", "Melur", "Peraiyur", "Vadipatti", "Usilampatti", "Kallikudi", "Natham", "Sholavandan", "Thiruppuvanam", "Chellampatti", "Alanganallur", "Othakadai", "Paravai", "Keelaiyur", "Thiruparankundram", "Avaniapuram", "Simmakkal", "Goripalayam", "Thallakulam"],
  "Thanjavur": ["Thanjavur", "Kumbakonam", "Pattukkottai", "Orathanadu", "Thiruvaiyaru", "Papanasam", "Ammapettai", "Thiruvidaimarudur", "Peravurani", "Sethubavachatram", "Madukkur", "Thiruvonam", "Vallam", "Budalur", "Ayyampettai", "Neelagiri", "Mariamman Koil", "Punnainallur", "Swamimalai", "Darasuram"],

  // ===== WEST BENGAL =====
  "Kolkata": ["Kolkata", "Salt Lake", "New Town", "Behala", "Jadavpur", "Tollygunge", "Ballygunge", "Alipore", "Garden Reach", "Metiabruz", "Santoshpur", "Sonarpur", "Garia", "Patuli", "Kasba", "Dhakuria", "Chetla", "Kalighat", "Park Street", "Esplanade"],
  "Darjeeling": ["Darjeeling", "Siliguri", "Kurseong", "Kalimpong", "Mirik", "Matigara", "Naxalbari", "Phansidewa", "Kharibari", "Sukna", "Bagdogra", "Tindharia", "Sonada", "Ghum", "Takdah", "Sukhiapokhri", "Tung", "Lebong", "Jorebungalow", "Nagri"],
  "Hooghly": ["Hooghly", "Chandernagore", "Serampore", "Bhadreswar", "Rishra", "Konnagar", "Uttarpara", "Chinsurah", "Bansberia", "Tarakeswar", "Arambagh", "Pursura", "Singur", "Haripal", "Dhaniakhali", "Polba", "Chanditala", "Jangipara", "Pandua", "Goghat"],
  "Bardhaman": ["Bardhaman", "Asansol", "Durgapur", "Kulti", "Raniganj", "Jamuria", "Kalna", "Katwa", "Memari", "Manteswar", "Ausgram", "Galsi", "Raina", "Madhabdihi", "Bhatar", "Mangalkote", "Jamalpur", "Ketugram", "Purbasthali", "Andal"],

  // ===== GUJARAT =====
  "Ahmedabad": ["Ahmedabad", "Dhandhuka", "Viramgam", "Sanand", "Bavla", "Dholka", "Ranpur", "Mandal", "Detroj-Rampura", "Barwala", "Daskroi", "Sarkhej", "Bopal", "Ghatlodiya", "Chandkheda", "Gota", "Nikol", "Odhav", "Narol", "Vatva"],
  "Surat": ["Surat", "Bardoli", "Kamrej", "Olpad", "Mandvi", "Mangrol", "Chorasi", "Palsana", "Umarpada", "Mahuva", "Limbayat", "Athwa", "Varachha", "Katargam", "Udhna", "Dindoli", "Sachin", "Pandesara", "Bamroli", "Kadodara"],
  "Rajkot": ["Rajkot", "Gondal", "Jetpur", "Dhoraji", "Jasdan", "Morbi", "Wankaner", "Tankara", "Lodhika", "Paddhari", "Kotda Sangani", "Jamkandorna", "Vinchhiya", "Kalavad", "Maliya", "Bhayavadar", "Padadhari", "Rajsamadhiyala", "Ghuntu", "Sanosara"],

  // ===== PUNJAB =====
  "Ludhiana": ["Ludhiana", "Khanna", "Jagraon", "Samrala", "Raikot", "Payal", "Machhiwara", "Doraha", "Sudhar", "Mullanpur Dakha", "Sidhwan Bet", "Dakha", "Sahnewal", "Gill", "Manuke", "Lalton Kalan", "Dehlon", "Koom Kalan", "Hambran", "Katana Sahib"],
  "Amritsar": ["Amritsar", "Tarn Taran", "Ajnala", "Attari", "Jandiala Guru", "Majitha", "Rayya", "Beas", "Lopoke", "Verka", "Chheharta", "Fatehgarh Churian", "Dera Baba Nanak", "Patti", "Khem Karan", "Sarhali", "Chogawan", "Wadala Bhittewad", "Bhikhiwind", "Naushera Pannuan"],

  // ===== HARYANA =====
  "Hisar": ["Hisar", "Hansi", "Barwala", "Uklana", "Adampur", "Agroha", "Bass", "Narnaund", "Arya Nagar", "Kirtan", "Mangali", "Jakhal", "Siswal", "Khedar", "Talwandi Rana", "Kharkara Meham", "Rawalwas Khurd", "Dhani Mahu", "Shahpur Turk", "Satrod Kalan"],
  "Rohtak": ["Rohtak", "Meham", "Kalanaur", "Sampla", "Lakhan Majra", "Dighal", "Bohar", "Pillukhera", "Kiloi", "Gochhi", "Mokhra Kheri", "Asthal Bohar", "Kharkhoda", "Ladhot", "Sunaria", "Sanghi", "Kansala", "Rithal", "Dubaldhan", "Gandhra"],

  // ===== MADHYA PRADESH =====
  "Bhopal": ["Bhopal", "Sehore", "Berasia", "Huzur", "Phanda", "Vidisha", "Sanchi", "Islamnagar", "Obedullaganj", "Raisen", "Udaipura", "Mandideep", "Misrod", "Kolar", "Bairagarh", "Ayodhya Nagar", "Habibganj", "Govindpura", "Kerwa", "Bhel"],
  "Indore": ["Indore", "Mhow", "Depalpur", "Sanwer", "Betma", "Hatod", "Gautampura", "Manpur", "Simrol", "Rau", "Pithampur", "Khudel", "Kanadiya", "Palda", "Tejpur Gadbadi", "Bhagirathpura", "Sukhliya", "Rajendra Nagar", "Vijay Nagar", "Annapurna"],
  "Jabalpur": ["Jabalpur", "Sihora", "Patan", "Katni", "Panagar", "Shahpura", "Barela", "Kundam", "Bargi", "Majholi", "Gosalpur", "Tilwara", "Richhai", "Maharajpur", "Garha", "Adhartal", "Wright Town", "Gwarighat", "Medghat", "Ranjhi"],
  "Ujjain": ["Ujjain", "Nagda", "Mahidpur", "Tarana", "Khachrod", "Ghatiya", "Barnagar", "Unhel", "Makdon", "Ingoria", "Kaytha", "Ghattia", "Jharda", "Badnagar", "Runija", "Chimanganj Mandi", "Dewas Gate", "Agar Road", "Madhav Nagar", "Freeganj"],

  // ===== ODISHA =====
  "Bhubaneswar": ["Bhubaneswar", "Cuttack", "Khordha", "Puri", "Jatni", "Pipli", "Banapur", "Tangi", "Balianta", "Balipatna", "Begunia", "Bolagarh", "Chilika", "Banapur", "Nimapara", "Konark", "Delang", "Nayagarh", "Ranpur", "Chandpur"],
  "Cuttack": ["Cuttack", "Choudwar", "Banki", "Athagarh", "Baramba", "Tigiria", "Narsinghpur", "Nischintakoili", "Tangi-Choudwar", "Salepur", "Mahanga", "Badamba", "Dampara", "Niali", "Kantapada", "Raghunathpur", "Narasinghpur", "Jagatpur", "Bidanasi", "Jobra"],

  // ===== KERALA =====
  "Thiruvananthapuram": ["Thiruvananthapuram", "Kovalam", "Neyyattinkara", "Varkala", "Attingal", "Chirayinkeezhu", "Kattakada", "Nedumangad", "Parassala", "Kaniyapuram", "Kazhakootam", "Peroorkada", "Sreekaryam", "Kesavadasapuram", "Medical College", "Thampanoor", "East Fort", "Vellayambalam", "Kowdiar", "Pattom"],
  "Ernakulam": ["Kochi", "Aluva", "Angamaly", "Perumbavoor", "Muvattupuzha", "Kothamangalam", "Piravom", "Vypeen", "Cherai", "Paravur", "Kalady", "Chalakudy", "Edappally", "Kakkanad", "Thrikkakara", "Kalamassery", "Eloor", "Palluruthy", "Fort Kochi", "Mattancherry"],

  // ===== CHHATTISGARH =====
  "Raipur": ["Raipur", "Durg", "Bhilai", "Rajnandgaon", "Bilaspur", "Korba", "Ambikapur", "Jagdalpur", "Raigarh", "Mahasamund", "Dhamtari", "Kanker", "Kawardha", "Mungeli", "Balod", "Bemetara", "Gariaband", "Tilda", "Abhanpur", "Arang"],

  // ===== JHARKHAND =====
  "Ranchi": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh", "Deoghar", "Giridih", "Dumka", "Ramgarh", "Phusro", "Bundu", "Mandar", "Namkum", "Chanho", "Burmu", "Kanke", "Ratu", "Angara", "Silli", "Sonahatu"],
};

// Get districts for a state
export function getDistrictsForState(stateCode: string): string[] {
  return stateDistricts[stateCode] || [];
}

// Get villages for a district
export function getVillagesForDistrict(district: string): string[] {
  return districtVillages[district] || [];
}

// Get state coordinates
export function getStateCoordinates(stateCode: string): { lat: number; lon: number } | null {
  const state = indianStates.find(s => s.code === stateCode);
  return state ? { lat: state.lat, lon: state.lon } : null;
}
