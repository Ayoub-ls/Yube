"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { TemplateProps } from '../types';
import { VoiceNotePlayer } from '../shared/VoiceNotePlayer';
import { SocialProofVideo } from '../shared/SocialProofVideo';

import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Check,
  ChevronDown,
  Volume2,
  Maximize2,
  Menu,
  X,
  BookOpen,
  ArrowLeft,
  Eye,
  Headphones,
  Hand,
  RefreshCw,
  Smile,
  Layers,
  Home,
  Building2,
  Loader2,
  AlertCircle,
  PackageCheck,
  PhoneCall,
  HelpCircle,
} from 'lucide-react';
import { KidsOrderForm } from '../shared/KidsOrderForm';

/* ------------------------------------------------------------------------ *
 *  STATIC REFERENCE DATA (not product-specific — kept inline so the whole
 *  template lives in a single file, same spirit as the Yalidine tariff
 *  matrix Algerian e-commerce templates rely on).
 * ------------------------------------------------------------------------ */

interface AlgerianWilaya {
  code: string;
  name: string;
  deliveryDays: string;
}

const ALGERIAN_WILAYAS: AlgerianWilaya[] = [
  { code: '01', name: '01 - أدرار (Adrar)', deliveryDays: '3-4 أيام' },
  { code: '02', name: '02 - الشلف (Chlef)', deliveryDays: '1-2 يوم' },
  { code: '03', name: '03 - الأغواط (Laghouat)', deliveryDays: '2-3 أيام' },
  { code: '04', name: '04 - أم البواقي (Oum El Bouaghi)', deliveryDays: '2-3 أيام' },
  { code: '05', name: '05 - باتنة (Batna)', deliveryDays: '2-3 أيام' },
  { code: '06', name: '06 - بجاية (Béjaïa)', deliveryDays: '1-2 يوم' },
  { code: '07', name: '07 - بسكرة (Biskra)', deliveryDays: '2-3 أيام' },
  { code: '08', name: '08 - بشار (Béchar)', deliveryDays: '3-4 أيام' },
  { code: '09', name: '09 - البليدة (Blida)', deliveryDays: '24-48 ساعة' },
  { code: '10', name: '10 - البويرة (Bouira)', deliveryDays: '24-48 ساعة' },
  { code: '11', name: '11 - تمنراست (Tamanrasset)', deliveryDays: '3-5 أيام' },
  { code: '12', name: '12 - تبسة (Tébessa)', deliveryDays: '2-3 أيام' },
  { code: '13', name: '13 - تلمسان (Tlemcen)', deliveryDays: '2 يوم' },
  { code: '14', name: '14 - تيارت (Tiaret)', deliveryDays: '2 يوم' },
  { code: '15', name: '15 - تيزي وزو (Tizi Ouzou)', deliveryDays: '24-48 ساعة' },
  { code: '16', name: '16 - الجزائر العاصمة (Alger)', deliveryDays: '24 ساعة' },
  { code: '17', name: '17 - الجلفة (Djelfa)', deliveryDays: '2 يوم' },
  { code: '18', name: '18 - جيجل (Jijel)', deliveryDays: '2 يوم' },
  { code: '19', name: '19 - سطيف (Sétif)', deliveryDays: '1-2 يوم' },
  { code: '20', name: '20 - سعيدة (Saïda)', deliveryDays: '2 يوم' },
  { code: '21', name: '21 - سكيكدة (Skikda)', deliveryDays: '2 يوم' },
  { code: '22', name: '22 - سيدي بلعباس (Sidi Bel Abbès)', deliveryDays: '1-2 يوم' },
  { code: '23', name: '23 - عنابة (Annaba)', deliveryDays: '1-2 يوم' },
  { code: '24', name: '24 - قالمة (Guelma)', deliveryDays: '2 يوم' },
  { code: '25', name: '25 - قسنطينة (Constantine)', deliveryDays: '1-2 يوم' },
  { code: '26', name: '26 - المدية (Médéa)', deliveryDays: '24-48 ساعة' },
  { code: '27', name: '27 - مستغانم (Mostaganem)', deliveryDays: '1-2 يوم' },
  { code: '28', name: "28 - المسيلة (M'Sila)", deliveryDays: '2 يوم' },
  { code: '29', name: '29 - معسكر (Mascara)', deliveryDays: '1-2 يوم' },
  { code: '30', name: '30 - ورقلة (Ouargla)', deliveryDays: '2-3 أيام' },
  { code: '31', name: '31 - وهران (Oran)', deliveryDays: '24-48 ساعة' },
  { code: '32', name: '32 - البيض (El Bayadh)', deliveryDays: '2-3 أيام' },
  { code: '33', name: '33 - إليزي (Illizi)', deliveryDays: '3-5 أيام' },
  { code: '34', name: '34 - برج بوعريريج (Bordj Bou Arréridj)', deliveryDays: '1-2 يوم' },
  { code: '35', name: '35 - بومرداس (Boumerdès)', deliveryDays: '24 ساعة' },
  { code: '36', name: '36 - الطارف (El Tarf)', deliveryDays: '2 يوم' },
  { code: '37', name: '37 - تندوف (Tindouf)', deliveryDays: '3-5 أيام' },
  { code: '38', name: '38 - تسمسيلت (Tissemsilt)', deliveryDays: '2 يوم' },
  { code: '39', name: '39 - الوادي (El Oued)', deliveryDays: '2-3 أيام' },
  { code: '40', name: '40 - خنشلة (Khenchela)', deliveryDays: '2-3 أيام' },
  { code: '41', name: '41 - سوق أهراس (Souk Ahras)', deliveryDays: '2 يوم' },
  { code: '42', name: '42 - تيبازة (Tipaza)', deliveryDays: '24 ساعة' },
  { code: '43', name: '43 - ميلة (Mila)', deliveryDays: '2 يوم' },
  { code: '44', name: '44 - عين الدفلى (Aïn Defla)', deliveryDays: '1-2 يوم' },
  { code: '45', name: '45 - النعامة (Naâma)', deliveryDays: '2-3 أيام' },
  { code: '46', name: '46 - عين تموشنت (Aïn Témouchent)', deliveryDays: '1-2 يوم' },
  { code: '47', name: '47 - غرداية (Ghardaïa)', deliveryDays: '2-3 أيام' },
  { code: '48', name: '48 - غليزان (Relizane)', deliveryDays: '1-2 يوم' },
  { code: '49', name: '49 - تيميمون (Timimoun)', deliveryDays: '3-5 أيام' },
  { code: '50', name: '50 - برج باجي مختار (Bordj Badji Mokhtar)', deliveryDays: '4-6 أيام' },
  { code: '51', name: '51 - أولاد جلال (Ouled Djellal)', deliveryDays: '2-3 أيام' },
  { code: '52', name: '52 - بني عباس (Béni Abbès)', deliveryDays: '3-5 أيام' },
  { code: '53', name: '53 - عين صالح (In Salah)', deliveryDays: '3-5 أيام' },
  { code: '54', name: '54 - عين قزام (In Guezzam)', deliveryDays: '4-6 أيام' },
  { code: '55', name: '55 - تقرت (Touggourt)', deliveryDays: '2-3 أيام' },
  { code: '56', name: '56 - جانت (Djanet)', deliveryDays: '3-5 أيام' },
  { code: '57', name: "57 - المغير (El M'Ghair)", deliveryDays: '2-3 أيام' },
  { code: '58', name: '58 - المنيعة (El Menia)', deliveryDays: '3-4 أيام' },
];

const ALGERIAN_COMMUNES_BY_WILAYA: Record<string, string[]> = {
  '01': ['Adrar', 'Tamest', 'Charouine', 'Reggane', 'In Zghmir', 'Tit', 'Tsabit', 'Aoulef', 'Timekten', 'Fenoughil', 'Zaouiet Kounta', 'Akabli'],
  '02': ['Chlef', 'Ténès', 'Benairia', 'El Karimia', 'Tadjena', 'Taougrite', 'Beni Haoua', 'Sobha', 'Harchoun', 'Ouled Fares', 'Sidi Akkacha', 'Boukadir', 'Beni Rached', 'Ain Merane', 'Oued Fodda', 'Chettia'],
  '03': ['Laghouat', 'Ksar El Hirane', 'Bennasser Benchohra', 'Sidi Makhlouf', 'Ain Madhi', 'Tadjemout', 'Hassi Delaa', "Hassi R'Mel", 'Ain Sidi Ali', 'Gueltat Sidi Saad', 'Aflou'],
  '04': ['Oum El Bouaghi', 'Ain Beida', "Ain M'lila", 'Ain Fakroun', 'Ain Babouche', 'Sigus', 'Ksar Sbahi', 'Meskiana', 'Ain Zitoun', 'Fkirina', 'Dhalaa'],
  '05': ['Batna', 'Barika', 'Ain Touta', 'Arris', 'Merouana', 'Tazoult', "N'Gaous", 'Seriana', 'Menaa', 'Ras El Aioun', 'Ain Djasser', 'Chemora', 'Khenchela', 'Timgad'],
  '06': ['Béjaïa', 'Amizour', 'Akbou', 'Seddouk', 'Tazmalt', 'Sidi Aïch', 'El Kseur', 'Timezrit', 'Adekar', 'Darguina', 'Aokas', 'Souk El Ténine', 'Tichy', 'Kherrata', 'Ighzer Amokrane'],
  '07': ['Biskra', 'Tolga', 'Sidi Okba', 'Chetma', 'Ourlal', 'Zeribet El Oued', 'El Kantara', "M'Chouneche", 'Ain Naga', 'Foughala', 'Lichana', 'Bouchagroune'],
  '08': ['Béchar', 'Kenadsa', 'Abadla', 'Taghit', 'Béni Ounif', 'Tabelbala', 'Lahmar', 'Boukais', 'Moungar', 'Erg Ferradj'],
  '09': ['Blida', 'Boufarik', 'Ouled Yaïch', 'Beni Mered', 'Bougara', 'Mouzaia', 'El Affroun', 'Chiffa', 'Hammam Melouane', 'Benkhelil', 'Soumaa', 'Meftah', 'Larbaa', 'Oued Alleug'],
  '10': ['Bouira', 'Lakhdaria', 'Sour El Ghouzlane', 'Ain Bessam', "M'Chedallah", 'Kadiria', 'Bechloul', 'Bir Ghbalou', 'Haizer', 'Taghzout', 'Aomar', 'El Hachimia'],
  '11': ['Tamanrasset', 'Abalessa', 'Idles', 'Tazrouk', 'In Amguel'],
  '12': ['Tébessa', 'Cheria', 'El Aouinet', 'El Kouif', 'Morsott', 'Bir El Ater', 'Ouenza', 'El Ogla', 'Negrine', 'Bir Mokkadem', 'Boukhadra'],
  '13': ['Tlemcen', 'Mansourah', 'Chetouane', 'Maghnia', 'Remchi', 'Ghazaouet', 'Nedroma', 'Sebdou', 'Hennaya', 'Ouled Mimoun', 'Beni Saf', 'Bab El Assa', 'Marsa Ben M\'Hidi', 'Bensekrane'],
  '14': ['Tiaret', 'Sougueur', 'Frenda', 'Ksar Chellala', 'Mahdia', 'Rahouia', 'Mechraa Sfa', 'Ain Deheb', 'Dahmouni', 'Oued Lilli', 'Hamadia', 'Takhemaret'],
  '15': ['Tizi Ouzou', 'Azazga', 'Tigzirt', 'Draâ Ben Khedda', 'Boghni', 'Larbaâ Nath Irathen', 'Ain El Hammam', 'Ouadhia', 'Makouda', 'Azeffoun', 'Tizi Gheniff', 'Ouaguenoun', 'Bouzeguene', 'Mekla'],
  '16': ['Alger Centre', 'Bab El Oued', 'Casbah', "Sidi M'Hamed", 'El Madania', 'El Mouradia', 'Hydra', 'Bir Mourad Raïs', 'Birmandreis', 'El Biar', 'Bouzareah', 'Ben Aknoun', 'Kouba', 'Hussein Dey', 'El Harrach', 'Bourouba', 'Bachedjerrah', 'Oued Smar', 'Bab Ezzouar', 'Bordj El Kiffan', 'Dar El Beïda', 'Ain Taya', 'El Marsa', 'Bordj El Bahri', 'Rouiba', 'Reghaia', 'Baraki', 'Les Eucalyptus', 'Sidi Moussa', 'Birtouta', 'Ouled Chebel', 'Tessala El Merdja', 'Zeralda', 'Staoueli', 'Ain Benian', 'Cheraga', 'Beni Messous', 'Dely Ibrahim', 'Draria', 'El Achour', 'Baba Hassen', 'Douera', 'Khraicia', 'Saoula'],
  '17': ['Djelfa', 'Ain Oussera', 'Messaad', 'Hassi Bahbah', 'Dar Chioukh', 'Charef', 'Idrisia', 'Birine', 'Sidi Ladjel', 'Faid El Botma', 'Had Sahary', 'Zaafrane'],
  '18': ['Jijel', 'Taher', 'El Milia', 'Chekfa', 'El Ancer', 'Sidi Abdelaziz', 'Kaous', 'Djimla', 'El Aouana', 'Ziama Mansouriah', 'Settara', 'Texenna'],
  '19': ['Sétif', 'El Eulma', 'Ain Oulmene', 'Ain Arnat', 'Ain Azel', 'Bougaa', 'Beni Aziz', 'Djemila', 'Guellal', 'Amoucha', 'Babor', 'Salah Bey', 'Hammam Guergour'],
  '20': ['Saïda', 'Ain El Hadjar', 'Youb', 'Sidi Boubekeur', 'El Hassasna', 'Ouled Brahim', 'Moulay Larbi'],
  '21': ['Skikda', 'El Hadaiek', 'Azzaba', 'Collo', 'Tamalous', 'El Harrouch', 'Ben Azzouz', 'Ramdane Djamel', 'Salah Bouchaour', 'Zitouna', 'Ain Kechra', 'Oum Toub'],
  '22': ['Sidi Bel Abbès', 'Telagh', 'Ben Badis', 'Sidi Ali Boussidi', 'Sfisef', 'Marhoum', 'Ras El Ma', 'Tessala', 'Mostefa Ben Brahim', 'Ain El Berd', 'Sidi Lahcene', 'Tenira'],
  '23': ['Annaba', 'El Bouni', 'El Hadjar', 'Sidi Amar', 'Berrahal', 'Ain Berda', 'Cheurfa', 'Oued El Aneb', 'Seraïdi', 'Treat'],
  '24': ['Guelma', 'Oued Zenati', 'Bouchegouf', 'Héliopolis', 'Guelaat Bou Sbaa', 'Hammam Debagh', 'Ain Hessania', 'Roknia', 'Belkheir', 'Tamlouka', 'Ain Makhlouf'],
  '25': ['Constantine', 'El Khroub', 'Ain Smara', 'Hamma Bouziane', 'Didouche Mourad', 'Zighoud Youcef', 'Ibn Ziad', 'Ouled Rahmoune', 'Ain Abid', 'Ben Badis', 'Ibn Badis', 'Ali Mendjeli'],
  '26': ['Médéa', 'Berrouaghia', 'Ksar El Boukhari', 'Beni Slimane', 'Tablat', 'Ain Boucif', 'Ouzera', 'Ouamri', 'Si Mahdjoub', 'El Omaria', 'Chahbounia', 'Souagui'],
  '27': ['Mostaganem', 'Ain Tedles', 'Hassi Mameche', 'Bouguirat', 'Sidi Ali', 'Mesra', 'Achaacha', 'Sidi Lakhdar', 'Kheir Eddine', 'Ain Nouissy', 'Fornaka', 'Stidia'],
  '28': ["M'Sila", 'Bou Saâda', 'Sidi Aissa', 'Ain El Hadjel', 'Magra', 'Ben Srour', 'Ouled Derradj', 'Hammam Dhalaa', 'Khoubana', 'Chellal', 'Belaiba', 'Ain El Melh'],
  '29': ['Mascara', 'Sig', 'Tighennif', 'Mohammadia', 'Ghriss', 'Oued El Abtal', 'Aouf', 'Ain Fares', 'Zahana', 'Bouhanifia', 'Froha', 'El Bordj'],
  '30': ['Ouargla', 'Hassi Messaoud', 'Rouissat', 'Ain Beida', "N'Goussa", 'Sidi Khouiled', 'Hassi Ben Abdallah', 'El Borma'],
  '31': ['Oran', 'Bir El Djir', 'Es Senia', 'Arzew', 'Ain El Turk', 'Bethioua', 'Gdyel', 'Boufatis', 'Oued Tlelat', 'Boutlelis', 'Mers El Kébir', 'El Ançor', 'Hassi Bounif', 'El Kerma', 'Sidi Chami', 'Hassi Mefsoukh'],
  '32': ['El Bayadh', 'Rogassa', 'Brezina', 'Bougtob', 'El Abiodh Sidi Cheikh', 'Labiodh Sidi Cheikh', 'Cheguig', 'Kef El Ahmar', 'Tousmouline'],
  '33': ['Illizi', 'In Amenas', 'Bordj Omar Driss', 'Debdeb'],
  '34': ['Bordj Bou Arréridj', 'Ras El Oued', 'Mansoura', 'Ain Taghrout', 'Medjana', 'Bordj Zemoura', 'El Achir', 'Bir Kasdali', 'Khelil', 'Ben Daoud', 'El Hamadia'],
  '35': ['Boumerdès', 'Khemis El Khechna', 'Dellys', 'Bordj Menaiel', 'Isser', 'Zemmouri', 'Thénia', 'Baghlia', 'Naciria', 'Larbatache', 'Hammedi', 'Ouled Moussa', 'Si Mustapha', 'Corso', 'Tidjelabine', 'Boudouaou'],
  '36': ['El Tarf', 'El Kala', "Ben M'Hidi", 'Besbes', 'Drean', 'Bouhadjar', 'Chebaita Mokhtar', 'Ain El Assel', 'Echatt', 'Asfour', 'Zitouna'],
  '37': ['Tindouf', 'Oum El Assel'],
  '38': ['Tissemsilt', 'Khemisti', 'Theniet El Had', 'Bordj Bounaama', 'Lardjem', 'Ammari', 'Youssoufia', 'Lazharia'],
  '39': ['El Oued', 'Robbah', 'Guemar', 'Debila', 'Kouinine', 'Bayadha', 'Taghzout', 'Hassani Abdelkrim', 'Magrane', 'Hassi Khalifa', 'Reguiba', 'Taleb Larbi'],
  '40': ['Khenchela', 'Kais', 'Chechar', 'Bouhmama', 'El Hamma', 'Ain Touila', 'Babar', 'Ouled Rechache', 'Remila', 'Yabous', 'Tamza'],
  '41': ['Souk Ahras', 'Sedrata', "M'Daourouch", 'Taoura', 'Mechroha', 'Heddada', 'Ouled Driss', 'Merahna', 'Zaarouria', 'Ain Zana'],
  '42': ['Tipaza', 'Cherchell', 'Kolea', 'Hadjiout', 'Bou Ismail', 'Fouka', 'Douaouda', 'Damous', 'Gouraya', 'Sidi Amar', 'Ahmar El Ain', 'Attatba', 'Chaiba', 'Ain Tagourait'],
  '43': ['Mila', 'Chelghoum Laid', 'Tadjenanet', 'Ferdjioua', 'Grarem Gouga', 'Teleghma', 'Rouached', 'Ain Beida Harriche', 'Oued Endja', 'Sidi Merouane', 'Terrai Bainen'],
  '44': ['Aïn Defla', 'Khemis Miliana', 'Miliana', 'El Attaf', 'Djelida', 'Djendel', 'Hammam Righa', 'El Abadia', 'Boumedfaa', 'Arib', 'Bourached', 'Rouina'],
  '45': ['Naâma', 'Mécheria', 'Ain Sefra', 'Tiout', 'Sfissifa', 'Moghrar', 'Asla', 'Djenienne Bourezg', 'Kasdir'],
  '46': ['Aïn Témouchent', 'Beni Saf', 'Hammam Bou Hadjar', 'El Malah', 'Ain El Arbaa', 'Oulhaca El Gheraba', 'El Amria', 'Ain Kihal', 'Sidi Ben Adda', 'Chaabat El Leham'],
  '47': ['Ghardaïa', 'El Guerrara', 'Bounoura', 'Dhayet Bendhahoua', 'Berriane', 'Metlili', 'El Atteuf', 'Zelfana', 'Sebseb', 'Mansoura'],
  '48': ['Relizane', 'Oued Rhiou', 'Mazouna', 'Ammi Moussa', 'Zemmora', 'Yellel', 'Djidiouia', 'Ain Tarek', "Sidi M'Hamed Ben Ali", 'El Matmar', 'Mendes'],
  '49': ['Timimoun', 'Aougrout', 'Deldoul', 'Ksar Kaddour', 'Charouine', 'Ouled Said', 'Talmine', 'Tinerkouk'],
  '50': ['Bordj Badji Mokhtar', 'Timiaouine'],
  '51': ['Ouled Djellal', 'Sidi Khaled', 'Ras El Miaad', 'Besbes', 'Doucen', 'Chaiba'],
  '52': ['Béni Abbès', 'Kerzaz', 'El Ouata', 'Igli', 'Tabelbala', 'Timoudi', 'Beni Ikhlef', 'Tamtert'],
  '53': ['In Salah', 'Foggaret Ezzaouia', 'In Ghar'],
  '54': ['In Guezzam', 'Tin Zaouatine'],
  '55': ['Touggourt', 'Nezla', 'Tebesbest', 'Zaouia El Abidia', 'Megarine', 'Temacine', 'Taibet', 'Benaceur', 'El Hadjira', 'Blidet Amor'],
  '56': ['Djanet', 'Bordj El Haouas'],
  '57': ["El M'Ghair", 'Djamaa', 'Oum Touyour', 'Sidi Amrane', 'Still', 'Tendla', "M'Rara"],
  '58': ['El Menia', 'Hassi Gara', 'Hassi Fehal'],
};

function getCommunesForWilaya(wilayaCode: string): string[] {
  const normalized = wilayaCode.padStart(2, '0');
  return ALGERIAN_COMMUNES_BY_WILAYA[normalized] || ALGERIAN_COMMUNES_BY_WILAYA[wilayaCode] || [];
}

interface WilayaTariff {
  code: string;
  wilaya_id: number;
  home_fee: number;
  desk_fee: number;
}

const STANDARD_YALIDINE_TARIFFS: Record<number, WilayaTariff> = {
  1: { code: '01', wilaya_id: 1, home_fee: 1200, desk_fee: 800 },
  2: { code: '02', wilaya_id: 2, home_fee: 600, desk_fee: 400 },
  3: { code: '03', wilaya_id: 3, home_fee: 850, desk_fee: 550 },
  4: { code: '04', wilaya_id: 4, home_fee: 750, desk_fee: 450 },
  5: { code: '05', wilaya_id: 5, home_fee: 700, desk_fee: 450 },
  6: { code: '06', wilaya_id: 6, home_fee: 650, desk_fee: 400 },
  7: { code: '07', wilaya_id: 7, home_fee: 750, desk_fee: 500 },
  8: { code: '08', wilaya_id: 8, home_fee: 950, desk_fee: 650 },
  9: { code: '09', wilaya_id: 9, home_fee: 500, desk_fee: 350 },
  10: { code: '10', wilaya_id: 10, home_fee: 600, desk_fee: 400 },
  11: { code: '11', wilaya_id: 11, home_fee: 1350, desk_fee: 850 },
  12: { code: '12', wilaya_id: 12, home_fee: 800, desk_fee: 500 },
  13: { code: '13', wilaya_id: 13, home_fee: 700, desk_fee: 450 },
  14: { code: '14', wilaya_id: 14, home_fee: 700, desk_fee: 450 },
  15: { code: '15', wilaya_id: 15, home_fee: 600, desk_fee: 400 },
  16: { code: '16', wilaya_id: 16, home_fee: 400, desk_fee: 250 },
  17: { code: '17', wilaya_id: 17, home_fee: 800, desk_fee: 500 },
  18: { code: '18', wilaya_id: 18, home_fee: 700, desk_fee: 450 },
  19: { code: '19', wilaya_id: 19, home_fee: 650, desk_fee: 400 },
  20: { code: '20', wilaya_id: 20, home_fee: 750, desk_fee: 500 },
  21: { code: '21', wilaya_id: 21, home_fee: 700, desk_fee: 450 },
  22: { code: '22', wilaya_id: 22, home_fee: 700, desk_fee: 450 },
  23: { code: '23', wilaya_id: 23, home_fee: 700, desk_fee: 450 },
  24: { code: '24', wilaya_id: 24, home_fee: 750, desk_fee: 450 },
  25: { code: '25', wilaya_id: 25, home_fee: 650, desk_fee: 400 },
  26: { code: '26', wilaya_id: 26, home_fee: 600, desk_fee: 400 },
  27: { code: '27', wilaya_id: 27, home_fee: 650, desk_fee: 400 },
  28: { code: '28', wilaya_id: 28, home_fee: 750, desk_fee: 450 },
  29: { code: '29', wilaya_id: 29, home_fee: 700, desk_fee: 450 },
  30: { code: '30', wilaya_id: 30, home_fee: 850, desk_fee: 550 },
  31: { code: '31', wilaya_id: 31, home_fee: 650, desk_fee: 400 },
  32: { code: '32', wilaya_id: 32, home_fee: 950, desk_fee: 650 },
  33: { code: '33', wilaya_id: 33, home_fee: 1350, desk_fee: 850 },
  34: { code: '34', wilaya_id: 34, home_fee: 650, desk_fee: 400 },
  35: { code: '35', wilaya_id: 35, home_fee: 500, desk_fee: 350 },
  36: { code: '36', wilaya_id: 36, home_fee: 750, desk_fee: 500 },
  37: { code: '37', wilaya_id: 37, home_fee: 1350, desk_fee: 850 },
  38: { code: '38', wilaya_id: 38, home_fee: 700, desk_fee: 450 },
  39: { code: '39', wilaya_id: 39, home_fee: 850, desk_fee: 550 },
  40: { code: '40', wilaya_id: 40, home_fee: 800, desk_fee: 500 },
  41: { code: '41', wilaya_id: 41, home_fee: 750, desk_fee: 500 },
  42: { code: '42', wilaya_id: 42, home_fee: 500, desk_fee: 350 },
  43: { code: '43', wilaya_id: 43, home_fee: 700, desk_fee: 450 },
  44: { code: '44', wilaya_id: 44, home_fee: 600, desk_fee: 400 },
  45: { code: '45', wilaya_id: 45, home_fee: 950, desk_fee: 650 },
  46: { code: '46', wilaya_id: 46, home_fee: 700, desk_fee: 450 },
  47: { code: '47', wilaya_id: 47, home_fee: 850, desk_fee: 550 },
  48: { code: '48', wilaya_id: 48, home_fee: 700, desk_fee: 450 },
  49: { code: '49', wilaya_id: 49, home_fee: 1100, desk_fee: 750 },
  50: { code: '50', wilaya_id: 50, home_fee: 1500, desk_fee: 950 },
  51: { code: '51', wilaya_id: 51, home_fee: 800, desk_fee: 550 },
  52: { code: '52', wilaya_id: 52, home_fee: 1100, desk_fee: 750 },
  53: { code: '53', wilaya_id: 53, home_fee: 1250, desk_fee: 800 },
  54: { code: '54', wilaya_id: 54, home_fee: 1500, desk_fee: 950 },
  55: { code: '55', wilaya_id: 55, home_fee: 850, desk_fee: 550 },
  56: { code: '56', wilaya_id: 56, home_fee: 1400, desk_fee: 900 },
  57: { code: '57', wilaya_id: 57, home_fee: 850, desk_fee: 550 },
  58: { code: '58', wilaya_id: 58, home_fee: 950, desk_fee: 650 },
};

function getStandardYalidineTariff(wilayaId: number | string): WilayaTariff {
  const num = typeof wilayaId === 'number' ? wilayaId : parseInt(wilayaId, 10);
  const validId = !isNaN(num) && num >= 1 && num <= 58 ? num : 16;
  return (
    STANDARD_YALIDINE_TARIFFS[validId] || {
      code: String(validId).padStart(2, '0'),
      wilaya_id: validId,
      home_fee: 600,
      desk_fee: 400,
    }
  );
}

interface YalidineTariffResponse {
  success: boolean;
  wilaya_id: number;
  commune?: string;
  delivery_type?: 'home' | 'office';
  home_fee: number | null;
  desk_fee: number | null;
  delivery_fee: number;
  currency: string;
  error?: string;
  from_cache?: boolean;
}

const tariffCache = new Map<string, YalidineTariffResponse>();
const communesCache = new Map<string, string[]>();
let activeTariffAbortController: AbortController | null = null;

function buildTariffCacheKey(wilayaCode: string, commune: string, deliveryType: string): string {
  const normWilaya = parseInt(wilayaCode, 10) || wilayaCode;
  const normCommune = commune.trim().toLowerCase();
  return `${normWilaya}:${normCommune}:${deliveryType}`;
}

async function fetchYalidineTariff(params: {
  wilayaCode: string;
  commune: string;
  deliveryType: 'home' | 'office';
}): Promise<YalidineTariffResponse> {
  const { wilayaCode, commune, deliveryType } = params;
  const cacheKey = buildTariffCacheKey(wilayaCode, commune, deliveryType);

  if (tariffCache.has(cacheKey)) {
    return { ...tariffCache.get(cacheKey)!, from_cache: true };
  }

  if (activeTariffAbortController) {
    activeTariffAbortController.abort();
  }
  activeTariffAbortController = new AbortController();

  const numericWilaya = parseInt(wilayaCode, 10);
  const queryParams = new URLSearchParams({
    wilaya: String(numericWilaya),
    commune: commune.trim(),
    type: deliveryType,
  });

  try {
    let data: any = null;
    try {
      const res = await fetch(`/api/yalidine/tariff?${queryParams.toString()}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: activeTariffAbortController.signal,
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json().catch(() => null);
      }
    } catch (netErr: any) {
      if (netErr?.name === 'AbortError') throw netErr;
    }

    if (!data || !data.success) {
      const standard = getStandardYalidineTariff(numericWilaya);
      const fee = deliveryType === 'office' ? standard.desk_fee : standard.home_fee;
      const fallbackResult: YalidineTariffResponse = {
        success: true,
        wilaya_id: standard.wilaya_id,
        commune: commune.trim() || undefined,
        delivery_type: deliveryType,
        home_fee: standard.home_fee,
        desk_fee: standard.desk_fee,
        delivery_fee: fee,
        currency: 'DA',
        from_cache: false,
      };
      tariffCache.set(cacheKey, fallbackResult);
      return fallbackResult;
    }

    const result: YalidineTariffResponse = {
      success: true,
      wilaya_id: data.wilaya_id,
      commune: data.commune,
      delivery_type: data.delivery_type || deliveryType,
      home_fee: data.home_fee,
      desk_fee: data.desk_fee,
      delivery_fee: Number(data.delivery_fee) || 0,
      currency: data.currency || 'DA',
    };
    tariffCache.set(cacheKey, result);
    return result;
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    const standard = getStandardYalidineTariff(numericWilaya);
    const fee = deliveryType === 'office' ? standard.desk_fee : standard.home_fee;
    return {
      success: true,
      wilaya_id: standard.wilaya_id,
      commune: commune.trim() || undefined,
      delivery_type: deliveryType,
      home_fee: standard.home_fee,
      desk_fee: standard.desk_fee,
      delivery_fee: fee,
      currency: 'DA',
    };
  } finally {
    activeTariffAbortController = null;
  }
}

async function fetchWilayaCommunes(wilayaCode: string): Promise<string[]> {
  const normCode = wilayaCode.padStart(2, '0');
  if (communesCache.has(normCode)) return communesCache.get(normCode)!;

  try {
    const num = parseInt(wilayaCode, 10);
    const res = await fetch(`/api/yalidine/communes?wilaya_id=${num}`, {
      headers: { Accept: 'application/json' },
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.communes) && data.communes.length > 0) {
        communesCache.set(normCode, data.communes);
        return data.communes;
      }
    }
  } catch {
    // fall through to local table
  }

  const fallback = getCommunesForWilaya(normCode);
  communesCache.set(normCode, fallback);
  return fallback;
}

function playEnglishWord(word: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.88;
    utterance.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  } catch {
    // fail silently if speech synthesis is blocked/unavailable
  }
}

interface OrderFormData {
  fullName: string;
  phoneNumber: string;
  wilayaCode: string;
  communeName: string;
  deliveryLocation: 'home' | 'office';
  notes?: string;
}

/* ------------------------------------------------------------------------ *
 *  MAIN TEMPLATE COMPONENT
 * ------------------------------------------------------------------------ */

export default function EnglishBook({ page, client, theme }: TemplateProps) {
  const themePrimary = theme?.primary || '#0F172A';
  const themeAccent = theme?.accent || '#DC2626';

  // ---- Product content (page-driven with sensible fallbacks) ----
  const defaultImages = [
    'https://images.unsplash.com/photo-1512253022256-e720d3e9a1ad?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=1200&auto=format&fit=crop',
  ];
  const images = page.product_images && page.product_images.length > 0 ? page.product_images : defaultImages;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const productName = page.product_name || 'كتاب الكلمات الإنجليزية التفاعلي الناطق';
  const primaryHeadline = page.page_config?.headline || productName;
  const subHeadline =
    page.page_config?.subheadline ||
    page.description ||
    'كتاب صوتي تفاعلي ممتع يجمع بين الرسومات التوضيحية الزاهية، وأساسيات مفردات اللغة الإنجليزية، وأزرار صوتية حسية حقيقية. يضغط طفلك بيده ليستمع فوراً للنطق الإنجليزي الصحيح ويكتسب الكلمات بطلاقة دون الحاجة إلى شاشات الهواتف.';

  const price = page.price ?? 9900;

  const bundleTitle = page.page_config?.bundleTitle || productName;
  const bundleSubtitle =
    page.page_config?.bundleSubtitle ||
    'النسخة الأصلية الكاملة مع 470+ كلمة وصوت مسجل وتوصيل مجاني لـ 58 ولاية';

  interface VocabWord {
    word: string;
    arabic?: string;
    phonetic?: string;
    category: string;
  }
  interface VocabularyCategory {
    id: string;
    title: string;
    arabic?: string;
    description: string;
    sampleWords: VocabWord[];
  }

  const defaultVocabularyCategories: VocabularyCategory[] = [
    {
      id: 'animals',
      title: 'الحيوانات الأليفة والبرية',
      description: 'حيوانات المزرعة، الحيوانات المنزلية الأليفة، وحيوانات الغابة بأصوات واضحة.',
      sampleWords: [
        { word: 'Lion', arabic: 'أسد', phonetic: '/ˈlaɪ.ən/', category: 'حيوانات برية' },
        { word: 'Cat', arabic: 'قطة', phonetic: '/kæt/', category: 'أليفة' },
        { word: 'Dog', arabic: 'كلب', phonetic: '/dɔːɡ/', category: 'أليفة' },
        { word: 'Elephant', arabic: 'فيل', phonetic: '/ˈel.ɪ.fənt/', category: 'حيوانات برية' },
        { word: 'Duck', arabic: 'بطة', phonetic: '/dʌk/', category: 'مزرعة' },
        { word: 'Horse', arabic: 'حصان', phonetic: '/hɔːrs/', category: 'مزرعة' },
      ],
    },
    {
      id: 'fruits',
      title: 'الفواكه والخضروات',
      description: 'الأطعمة الصحية اليومية التي يراها الطفل ويتناولها على مائدة الطعام.',
      sampleWords: [
        { word: 'Apple', arabic: 'تفاحة', phonetic: '/ˈæp.əl/', category: 'فواكه' },
        { word: 'Banana', arabic: 'موز', phonetic: '/bəˈnæn.ə/', category: 'فواكه' },
        { word: 'Orange', arabic: 'برتقال', phonetic: '/ˈɔːr.ɪndʒ/', category: 'فواكه' },
        { word: 'Carrot', arabic: 'جزر', phonetic: '/ˈkær.ət/', category: 'خضار' },
        { word: 'Tomato', arabic: 'طماطم', phonetic: '/təˈmeɪ.toʊ/', category: 'خضار' },
        { word: 'Strawberry', arabic: 'فراولة', phonetic: '/ˈstrɔːˌber.i/', category: 'فواكه' },
      ],
    },
    {
      id: 'transport',
      title: 'المركبات ووسائل النقل',
      description: 'وسائل النقل البرية والجوية والبحرية التي تشعل فضول الأطفال وحماسهم.',
      sampleWords: [
        { word: 'Car', arabic: 'سيارة', phonetic: '/kɑːr/', category: 'طريق' },
        { word: 'Bus', arabic: 'حافلة', phonetic: '/bʌs/', category: 'نقل عام' },
        { word: 'Train', arabic: 'قطار', phonetic: '/treɪn/', category: 'سكك حديدية' },
        { word: 'Airplane', arabic: 'طائرة', phonetic: '/ˈer.pleɪn/', category: 'طيران' },
        { word: 'Bicycle', arabic: 'دراجة', phonetic: '/ˈbaɪ.sə.kəl/', category: 'رياضة' },
        { word: 'Boat', arabic: 'قارب', phonetic: '/boʊt/', category: 'بحري' },
      ],
    },
    {
      id: 'nature',
      title: 'الطبيعة وعناصر الطقس',
      description: 'عناصر الطبيعة في الهواء الطلق ومفردات الطقس والبيئة المحيطة.',
      sampleWords: [
        { word: 'Sun', arabic: 'شمس', phonetic: '/sʌn/', category: 'فضاء' },
        { word: 'Rain', arabic: 'مطر', phonetic: '/reɪn/', category: 'طقس' },
        { word: 'Tree', arabic: 'شجرة', phonetic: '/triː/', category: 'نبات' },
        { word: 'Flower', arabic: 'زهرة', phonetic: '/ˈflaʊ.ər/', category: 'حديقة' },
        { word: 'Moon', arabic: 'قمر', phonetic: '/muːn/', category: 'ليل' },
        { word: 'Star', arabic: 'نجمة', phonetic: '/stɑːr/', category: 'سماء' },
      ],
    },
    {
      id: 'everyday',
      title: 'أدوات وأشياء من حولنا',
      description: 'مفردات الأثاث المنزلي المألوف، الملابس، والألعاب المفضلة لدى الطفل.',
      sampleWords: [
        { word: 'Bed', arabic: 'سرير', phonetic: '/bed/', category: 'غرفة النوم' },
        { word: 'Chair', arabic: 'كرسي', phonetic: '/tʃer/', category: 'منزل' },
        { word: 'Clock', arabic: 'ساعة', phonetic: '/klɑːk/', category: 'منزل' },
        { word: 'Shoes', arabic: 'حذاء', phonetic: '/ʃuːz/', category: 'ملابس' },
        { word: 'Book', arabic: 'كتاب', phonetic: '/bʊk/', category: 'دراسة' },
        { word: 'Ball', arabic: 'كرة', phonetic: '/bɔːl/', category: 'ألعاب' },
      ],
    },
  ];
  const vocabularyCategories: VocabularyCategory[] =
    page.page_config?.vocabularyCategories && page.page_config.vocabularyCategories.length > 0
      ? page.page_config.vocabularyCategories
      : defaultVocabularyCategories;

  const defaultHowItWorksSteps = [
    { stepNumber: '01', title: 'اختر الرسمة', description: 'يتصفح الطفل الصفحات الملونة ويختار صورة حيوان، فاكهة، أو وسيلة نقل تلفت انتباهه.' },
    { stepNumber: '02', title: 'اضغط على الزر الصوتي', description: 'يحدد الزر المطابق في اللوحة الصوتية المدمجة ويضغط عليه بإصبعه الصغير بكل سهولة.' },
    { stepNumber: '03', title: 'استمع للنطق الإنجليزي', description: 'يقوم مكبر الصوت المدمج فوراً بنطق الكلمة الإنجليزية بوضوح تام ونبرة نقية وسليمة.' },
    { stepNumber: '04', title: 'ردد وتعلّم بطلاقة', description: 'يردد الطفل الكلمة مع النظر إلى الصورة ليرسخ نطق الكلمة وشكلها في ذاكرته فوراً.' },
  ];
  const howItWorksSteps = page.page_config?.howItWorksSteps || defaultHowItWorksSteps;
  const stepIcons = [BookOpen, Hand, Volume2, RefreshCw];

  const defaultWhyParentsBuy = [
    { title: 'تعليم هادف وبديل حقيقي للشاشات', description: 'يمنح طفلك نشاطاً سمعياً وحركياً ممتعاً دون تعريض عينيه لإجهاد شاشات الهواتف الذكية أو الأجهزة اللوحية.' },
    { title: 'دمج متكامل بين الرؤية، اللمس، والاستماع', description: 'يستوعب الصغار المفردات أسرع بثلاث مرات عندما تتشارك حواسهم؛ الضغط باليد مع سماع الصوت يرسخ صورة الكلمة في الدماغ.' },
    { title: 'تشجيع الاستكشاف المستقل وبناء الثقة', description: 'تصميم الأزرار البسيط يمكّن الطفل من تصفح الكتاب بمفرده وبثقة، مما يتيح للأولياء أوقات راحة بينما يواصل الطفل تعلمه.' },
    { title: 'نطق إنجليزي أصلي سليم 100%', description: 'تسجيلات صوتية إنجليزية نقية وصحيحة تجعل الطفل يلتقط مخارج الحروف الصحيحة واللكنة السليمة منذ سنواته الأولى.' },
    { title: 'متانة فائقة مصممة للأيدي الصغيرة', description: 'ورق مقوى سميك بطبقة لامعة واقية وحجرة بطاريات محكمة ببرغي أمان تجعل الكتاب مقاوماً للصدمات والسقوط المتكرر.' },
  ];
  const whyParentsBuy = page.page_config?.whyParentsBuy || defaultWhyParentsBuy;
  const benefitIcons = [Layers, Sparkles, Smile, BookOpen, ShieldCheck];

  const defaultFaqs = [
    { question: 'كيف يعمل هذا الكتاب الصوتي التفاعلي؟', answer: 'يحتوي الكتاب على أزرار حسية مدمجة بجانب كل صورة توضيحية. عندما يضغط الطفل بإصبعه على الزر المقابل لأي رسمة، ينطق مكبر الصوت المدمج الكلمة باللغة الإنجليزية بنبرة نقية ومخارج حروف واضحة.' },
    { question: 'كم عدد الأصوات والكلمات الموجودة في الكتاب؟', answer: 'يحتوي الكتاب على أكثر من 470 كلمة وصوت مسجل، تشمل مفردات المحادثة المبكرة، أسماء وأصوات الحيوانات، وسائل النقل، الأطعمة، والأدوات المحيطة بالطفل.' },
    { question: 'ما هي المفردات التي سيتعلمها طفلي من الكتاب؟', answer: 'يغطي الكتاب الفئات الأساسية للحياة اليومية مثل: الحيوانات والطيور، الفواكه والخضار، الألوان، أفراد العائلة، الملابس، المركبات، والطقس والطبيعة.' },
    { question: 'هل صفحات الكتاب متينة وتتحمل استخدام الأطفال؟', answer: 'نعم بكل تأكيد. صُنعت صفحات الكتاب من الكرتون المقوى السميك والمغلف، مع حواف دائرية آمنة، مما يجعلها مقاومة للثني، التمزق، والبلل الخفيف.' },
    { question: 'هل توفرون خدمة الدفع عند الاستلام (Paiement à la livraison)؟', answer: 'نعم، خدمة الدفع عند الاستلام متوفرة لجميع ولايات الجزائر الـ 58. لا تدفع أي دينار مسبقاً، بل تدفع للموزع فقط بعد استلام طردك ومعاينته عند باب منزلك.' },
    { question: 'كم تستغرق مدة التوصيل إلى ولايتي؟', answer: 'يستغرق التوصيل عادةً بين 24 إلى 48 ساعة للولايات الشمالية والوسطى، ومن 48 إلى 72 ساعة لولايات الهضاب والجنوب.' },
  ];
  const faqItems = page.page_config?.faqs && page.page_config.faqs.length > 0 ? page.page_config.faqs : defaultFaqs;

  const reviewsList = page.reviews && page.reviews.length > 0 ? page.reviews : null;
  const socialProofList = page.social_proof && page.social_proof.length > 0 ? page.social_proof : null;

  // ---- UI state ----
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  const [playingAudioSrc, setPlayingAudioSrc] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(vocabularyCategories[0]?.id || '');
  const currentCategory = vocabularyCategories.find((c) => c.id === selectedCategoryId) || vocabularyCategories[0];
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stickyBarVisible, setStickyBarVisible] = useState(false);

  const handleTestSound = (word: string) => {
    setPlayingWord(word);
    playEnglishWord(word);
    setTimeout(() => setPlayingWord(null), 1200);
  };

  const scrollToOrderForm = () => {
    setMobileMenuOpen(false);
    const el = document.getElementById('order-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        document.getElementById('order-full-name')?.focus();
      }, 500);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const submitBtn = document.getElementById('confirm-order-submit-btn');
      if (submitBtn) {
        const rect = submitBtn.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          setStickyBarVisible(false);
          return;
        }
      }
      setStickyBarVisible(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ---- Checkout / order form state ----
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phoneNumber: '',
    wilayaCode: '16',
    communeName: 'Bordj El Kiffan',
    deliveryLocation: 'home',
    notes: '',
  });
  const [communesList, setCommunesList] = useState<string[]>(() => getCommunesForWilaya('16'));
  const [isLoadingCommunes, setIsLoadingCommunes] = useState(false);
  const [tariffLoading, setTariffLoading] = useState(false);
  const [yalidineTariff, setYalidineTariff] = useState<YalidineTariffResponse | null>(() => {
    const std = getStandardYalidineTariff(16);
    return {
      success: true,
      wilaya_id: 16,
      commune: 'Bordj El Kiffan',
      delivery_type: 'home',
      home_fee: std.home_fee,
      desk_fee: std.desk_fee,
      delivery_fee: std.home_fee,
      currency: 'DA',
    };
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [submittedOrder, setSubmittedOrder] = useState<{
    id: string;
    fullName: string;
    phone: string;
    wilayaName: string;
    communeName: string;
    deliveryLocation: 'home' | 'office';
    deliveryFee: number;
    bundleTitle: string;
    totalAmount: number;
    deliveryEstimate: string;
  } | null>(null);

  const selectedWilaya = ALGERIAN_WILAYAS.find((w) => w.code === formData.wilayaCode) || ALGERIAN_WILAYAS[15];
  const deliveryFee = yalidineTariff ? yalidineTariff.delivery_fee : 0;
  const finalTotal = price + deliveryFee;

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCommunes(true);
    fetchWilayaCommunes(formData.wilayaCode)
      .then((communes) => {
        if (!isMounted) return;
        setCommunesList(communes);
        if (communes.length > 0 && !communes.includes(formData.communeName)) {
          setFormData((prev) => ({ ...prev, communeName: communes[0] }));
        }
      })
      .catch(() => {
        if (!isMounted) return;
        const fallback = getCommunesForWilaya(formData.wilayaCode);
        setCommunesList(fallback);
        if (fallback.length > 0 && !fallback.includes(formData.communeName)) {
          setFormData((prev) => ({ ...prev, communeName: fallback[0] }));
        }
      })
      .finally(() => {
        if (isMounted) setIsLoadingCommunes(false);
      });
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.wilayaCode]);

  const executeTariffFetch = useCallback((wilayaCode: string, communeName: string, deliveryLocation: 'home' | 'office') => {
    if (!communeName) {
      setYalidineTariff(null);
      return;
    }
    setTariffLoading(true);
    fetchYalidineTariff({ wilayaCode, commune: communeName, deliveryType: deliveryLocation })
      .then((tariff) => setYalidineTariff(tariff))
      .catch((err: any) => {
        if (err?.name === 'AbortError') return;
        const std = getStandardYalidineTariff(wilayaCode);
        const fee = deliveryLocation === 'office' ? std.desk_fee : std.home_fee;
        setYalidineTariff({
          success: true,
          wilaya_id: std.wilaya_id,
          commune: communeName,
          delivery_type: deliveryLocation,
          home_fee: std.home_fee,
          desk_fee: std.desk_fee,
          delivery_fee: fee,
          currency: 'DA',
        });
      })
      .finally(() => setTariffLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      executeTariffFetch(formData.wilayaCode, formData.communeName, formData.deliveryLocation);
    }, 250);
    return () => clearTimeout(timer);
  }, [formData.wilayaCode, formData.communeName, formData.deliveryLocation, executeTariffFetch]);

  const validate = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.fullName.trim()) errors.fullName = 'يرجى إدخال الاسم واللقب.';
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'يرجى إدخال رقم الهاتف.';
    } else if (formData.phoneNumber.replace(/\s+/g, '').length < 9) {
      errors.phoneNumber = 'يرجى إدخال رقم هاتف جزائري صالح يتكون من 9 أو 10 أرقام.';
    }
    if (!formData.communeName.trim()) errors.communeName = 'يرجى اختيار البلدية.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const orderId = `${(client.slug || 'DZ').toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedOrder({
      id: orderId,
      fullName: formData.fullName,
      phone: formData.phoneNumber,
      wilayaName: selectedWilaya.name,
      communeName: formData.communeName,
      deliveryLocation: formData.deliveryLocation,
      deliveryFee,
      bundleTitle,
      totalAmount: finalTotal,
      deliveryEstimate: selectedWilaya.deliveryDays,
    });
  };

  const navLinks = [
    { label: 'كيف يعمل الكتاب', href: '#how-it-works' },
    { label: 'محتوى الكلمات', href: '#whats-inside' },
    { label: 'لماذا يفضله الأولياء', href: '#benefits' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
  ];

  return (
    <div
      className="min-h-screen bg-[#FDFCFB] text-[#1E293B] flex flex-col antialiased selection:bg-[var(--t-primary)] selection:text-white pb-20 sm:pb-24 md:pb-0"
      style={{ '--t-primary': themePrimary, '--t-accent': themeAccent } as React.CSSProperties}
    >
      {/* ============================= HEADER ============================= */}
      <div className="bg-[var(--t-primary)] text-slate-300 text-[11px] font-semibold py-1.5 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-slate-200 truncate">
            <Truck className="w-3.5 h-3.5 text-[var(--t-accent)] shrink-0" />
            <span className="truncate">
              التوصيل متوفر لـ <strong>58 ولاية</strong> • الدفع عند الاستلام (COD)
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[11px] shrink-0">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>افحص الطرد وتأكد قبل الدفع</span>
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-13 sm:h-15 flex items-center justify-between gap-2">
          <a href="#" className="flex items-center gap-2 text-[var(--t-primary)] group min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[var(--t-primary)] text-white flex items-center justify-center shadow-xs shrink-0">
              <BookOpen className="w-4 h-4 text-[var(--t-accent)]" />
            </div>
            <div className="min-w-0">
              <div className="font-black tracking-tight text-xs sm:text-base leading-tight text-[var(--t-primary)] truncate">
                {client.business_name || 'كتاب الكلمات الإنجليزية'}
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-[var(--t-accent)]">
                <span>كتاب صوتي تفاعلي</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-semibold">+470 كلمة وصوت</span>
              </div>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-slate-700">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-[var(--t-accent)] transition-colors py-1 text-xs lg:text-sm">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              onClick={scrollToOrderForm}
              className="bg-[var(--t-primary)] hover:brightness-110 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-black tracking-wide transition-all shadow-sm flex items-center gap-1 cursor-pointer min-h-[36px] sm:min-h-[38px]"
            >
              <span>اطلب الآن</span>
              <ArrowLeft className="w-3.5 h-3.5 hidden sm:inline" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="قائمة التصفح"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-slate-800 hover:text-[var(--t-accent)] font-bold py-2 text-sm border-b border-slate-100"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={scrollToOrderForm}
                className="w-full bg-[var(--t-primary)] hover:brightness-110 text-white font-bold py-3 rounded-lg text-center transition-colors text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>اطلب الآن — الدفع عند الاستلام </span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* ============================= HERO ============================= */}
        <section id="hero" className="bg-[#F8FAFC] border-b border-slate-200 py-6 sm:py-10 lg:py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="lg:hidden w-full text-center mb-5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[var(--t-accent)] bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>كتاب صوتي تفاعلي ناطق للأطفال</span>
              </div>
              <h1 className="text-2xl font-black text-[var(--t-primary)] tracking-tight leading-tight">{primaryHeadline}</h1>
              <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                <span className="inline-flex items-center text-xs font-black text-white bg-[var(--t-accent)] px-3 py-1.5 rounded-lg shadow-xs">+470 كلمة</span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--t-primary)] bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                  <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                  صوت مسجل
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
                  <Truck className="w-3.5 h-3.5 text-slate-600" />
                  التوصيل إلى 58 ولاية
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
              {/* Gallery */}
              <div className="lg:col-span-6 flex flex-col items-center">
                <div className="w-full max-w-lg bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-md sm:shadow-xl shadow-slate-200/50 relative">
                  <div className="absolute top-5 right-5 z-10 bg-[var(--t-primary)]/90 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <Volume2 className="w-3 h-3 text-amber-400 animate-pulse" />
                    <span>كتاب صوتي تفاعلي ناطق</span>
                  </div>

                  <div
                    className="w-full aspect-4/3 max-h-[320px] sm:max-h-none overflow-hidden rounded-xl bg-slate-100 flex items-center justify-center border border-slate-100 relative group cursor-zoom-in"
                    onClick={() => setLightboxImage(images[activeImageIndex])}
                  >
                    <img
                      src={images[activeImageIndex]}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-3 left-3 bg-[var(--t-primary)]/80 text-white p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`aspect-4/3 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${activeImageIndex === idx
                          ? 'border-[var(--t-accent)] ring-2 ring-red-100 shadow-sm scale-102'
                          : 'border-slate-200 hover:border-slate-300 opacity-80 hover:opacity-100'
                          }`}
                      >
                        <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>

                  <div className="mt-3.5 p-2.5 sm:p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[var(--t-primary)] text-white flex items-center justify-center shrink-0">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[var(--t-primary)] block leading-tight">معاينة الصوت والنطق</span>
                        <span className="text-slate-500 text-[10px]">اضغط للاستماع إلى النطق الإنجليزي:</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { word: 'Apple', ar: 'Apple 🍎' },
                        { word: 'Lion', ar: 'Lion 🦁' },
                        { word: 'Bus', ar: 'Bus 🚌' },
                      ].map((item) => (
                        <button
                          key={item.word}
                          type="button"
                          onClick={() => handleTestSound(item.word)}
                          className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${playingWord === item.word
                            ? 'bg-[var(--t-accent)] text-white border-[var(--t-accent)] shadow-xs'
                            : 'bg-white hover:bg-slate-100 text-[var(--t-primary)] border-slate-200'
                            }`}
                        >
                          <Volume2 className={`w-3 h-3 ${playingWord === item.word ? 'text-white' : 'text-slate-400'}`} />
                          <span dir="ltr">{item.ar}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 w-full max-w-lg grid grid-cols-3 gap-2 py-2.5 px-3 bg-white border border-slate-200 rounded-xl text-center shadow-xs">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-lg sm:text-xl font-black text-[var(--t-accent)]">+470</div>
                    <div className="text-[11px] font-bold text-slate-700">كلمة وصوت مسجل</div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-r border-slate-200">
                    <div className="text-lg sm:text-xl font-black text-[var(--t-primary)]">24</div>
                    <div className="text-[11px] font-bold text-slate-700">موضوعاً تعليمياً</div>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-r border-slate-200">
                    <div className="text-lg sm:text-xl font-black text-emerald-600">100%</div>
                    <div className="text-[11px] font-bold text-slate-700">بدون شاشات</div>
                  </div>
                </div>
              </div>

              {/* Copy + price + CTA */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <div className="hidden lg:block">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="bg-[var(--t-primary)] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      كتاب صوتي تفاعلي ناطق
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-600 text-xs font-bold">للأطفال من 1 إلى 6 سنوات</span>
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight leading-tight">{primaryHeadline}</h1>
                  <div className="flex items-center gap-2.5 mt-3 mb-3">
                    <span className="inline-flex items-center text-xs font-black text-white bg-[var(--t-accent)] px-3 py-1 rounded-md">+470 كلمة</span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[var(--t-primary)] bg-slate-100 px-2.5 py-1 rounded-md">
                      <Volume2 className="w-3.5 h-3.5 text-amber-500" />
                      صوت مسجل
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      <Truck className="w-3.5 h-3.5 text-slate-600" />
                      التوصيل إلى 58 ولاية
                    </span>
                  </div>
                </div>

                <p className="mt-1 lg:mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">{subHeadline}</p>

                <div className="mt-4 space-y-2">
                  {[
                    { n: '01', t: 'شاهد الصورة واربطها بالاسم', d: 'رسومات ملونة زاهية تبني في ذهن الطفل تمييزاً بصرياً فورياً لشكل الشيء واسمه.' },
                    { n: '02', t: 'اضغط على الزر واستمع للنطق السليم', d: 'أزرار حسية مريحة تنطق الكلمات الإنجليزية بنبرة نقية ومخارج حروف واضحة جداً.' },
                    { n: '03', t: 'ردد وأتقن المفردات بحرية وبدون شاشات', d: 'تجربة تعليمية آمنة 100% بدون هواتف أو شاشات، يستمتع بها الطفل بمفرده في البيت.' },
                  ].map((row) => (
                    <div key={row.n} className="flex items-start gap-2.5 p-2 bg-white border border-slate-200/70 rounded-xl">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[var(--t-accent)] font-black text-xs shrink-0 mt-0.5">{row.n}</div>
                      <div>
                        <h4 className="font-bold text-[var(--t-primary)] text-xs sm:text-sm">{row.t}</h4>
                        <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{row.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 bg-white border-2 border-slate-200 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200/40 relative overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-0.5">السعر الخاص — عرض حصري ومحدود</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight">{price.toLocaleString()} DA</span>

                      </div>
                    </div>
                  </div>

                  <div className="pt-3.5">
                    <button
                      type="button"
                      onClick={scrollToOrderForm}
                      className="w-full bg-red-600 hover:brightness-110 text-white py-3.5 px-6 rounded-xl font-black text-sm sm:text-base transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                    >
                      <span>اطلب الآن — الدفع عند الاستلام</span>
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[11px] sm:text-xs text-slate-500 mt-2 flex items-center justify-center gap-1.5 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>تدفع نقداً فقط عند استلام وفحص الطرد • لا يلزم بطاقة بنكية</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
                    <div className="flex flex-col items-center justify-center">
                      <Truck className="w-3.5 h-3.5 text-[var(--t-primary)] mb-0.5" />
                      <span className="text-[10px] sm:text-[11px] font-bold">توصيل 58 ولاية</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-r border-slate-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mb-0.5" />
                      <span className="text-[10px] sm:text-[11px] font-bold">الدفع عند الاستلام</span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-r border-slate-200">
                      <PackageCheck className="w-3.5 h-3.5 text-[var(--t-primary)] mb-0.5" />
                      <span className="text-[10px] sm:text-[11px] font-bold">معاينة قبل الدفع</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================== WHY INTERACTIVE LEARNING ==================== */}
        <section id="why-different" className="bg-white py-16 sm:py-24 border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[11px] font-bold text-[var(--t-primary)] bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
                التعلم التفاعلي مقابل التلقين الصامت
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight">
                يتعلم الأطفال الكلمات بشكل أسرع عندما يرون، يستمعون، ويتفاعلون
              </h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                نادراً ما يتعلم الصغار لغة جديدة عبر التلقين الجاف أو المشاهدة السلبية لمقاطع الفيديو السريعة. بل يتعلمون بالتفاعل واللمس: لمس الشيء، سماع صوته، وترديده بفرح.
              </p>
            </div>

            <div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { icon: Eye, step: 'مشاهدة الرسمة والكلمة', description: 'يرى الطفل رسماً كرتونياً واضحاً وجذاباً مع كتابة الكلمة بالإنجليزية، مما يبني تمييزاً بصرياً فورياً لشكل الشيء واسمه.' },
                { icon: Headphones, step: 'الاستماع للنطق الصحيح', description: 'الضغط على الزر الحسي يُصدر صوتاً إنجليزياً نقياً بنبرة واضحة تساعد الطفل على التقاط مخارج الحروف بدقة.' },
                { icon: Sparkles, step: 'ربط الصوت بالصورة في الذهن', description: 'ربط الصوت المسموع مباشرة بالصورة الملونة يرسخ المفردات في الذاكرة طويلة المدى دون الحاجة لترجمة معقدة.' },
                { icon: RotateCcw, step: 'التكرار والترديد بكل حرية', description: 'لأن الكتاب مصمم ليكون ذاتي التشغيل، يستطيع الطفل الضغط والتكرار والترديد عشرات المرات بحماس ودون ملل.' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-[var(--t-accent)] mb-5">
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm sm:text-base font-black text-[var(--t-primary)] mb-2.5">{item.step}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-slate-400">
                      <span>الخطوة {idx + 1}</span>
                      <span className="font-mono">0{idx + 1}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 sm:mt-16 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <span className="text-[11px] font-bold text-slate-500 block mb-1">مقارنة واقعية وعملية</span>
                <h3 className="text-base sm:text-xl font-black text-[var(--t-primary)]">مقارنة طرق ممارسة الإنجليزية للأطفال في المنزل</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/90 space-y-4">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">✕</span>
                    <span>الشاشات والكتب الصامتة العادية</span>
                  </div>
                  <ul className="space-y-3 text-slate-600 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>الكتب الورقية العادية صامتة تماماً وتتطلب من الوالدين نطق كل كلمة.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>شاشات الهواتف تسبب إجهاداً للعين وتشتت تركيز الطفل بالمؤثرات السريعة.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <X className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <span>المشاهدة السلبية للفيديوهات تفتقر للتفاعل الحركي والضغط بالأصابع.</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-xl border-2 border-[var(--t-accent)] shadow-sm space-y-4 relative">
                  <div className="font-black text-[var(--t-accent)] text-xs sm:text-sm flex items-center gap-2.5 pb-3 border-b border-red-100">
                    <Check className="w-5 h-5 text-[var(--t-accent)]" />
                    <span>{productName}</span>
                  </div>
                  <ul className="space-y-3 text-slate-800 text-xs sm:text-sm">
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>يضغط الطفل ويستمع:</strong> نطق إنجليزي فوري بصوت واضح ونقي.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>100% بدون شاشات:</strong> صفحات كرتونية سميكة مع أزرار حسية ملموسة.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>تعلم ذاتي مستقل:</strong> يتصفح الطفل ويستمع بمفرده ويبني ثقته بنفسه.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================= HOW IT WORKS ========================= */}
        <section id="how-it-works" className="bg-slate-50/50 py-16 sm:py-24 border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[11px] font-bold text-[var(--t-primary)] bg-white border border-slate-200 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
                بسيط وتفاعلي وسهل
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight">كيف يعمل الكتاب الصوتي في 4 خطوات بسيطة</h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                مصمم خصيصاً لأيدي الأطفال الصغار. بدون تعليمات معقدة، بدون شاشات أو ربط بلوتوث، وبدون كلمات سر. فقط اختر الصورة، اضغط على الزر، واستمع للنطق السليم.
              </p>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {howItWorksSteps.map((step: any, idx: number) => {
                const Icon = stepIcons[idx] || Volume2;
                return (
                  <div key={step.stepNumber} className="bg-white border border-slate-200/90 rounded-2xl p-6 relative flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all">
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-[var(--t-accent)] font-black flex items-center justify-center text-sm font-mono">
                          {step.stepNumber}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[var(--t-primary)] text-white flex items-center justify-center shadow-xs">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>
                      <h3 className="text-base font-black text-[var(--t-primary)] mb-2">{step.title}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
                    </div>
                    <div className="mt-6 pt-3.5 border-t border-slate-100 text-[11px] font-bold text-slate-400">الخطوة {idx + 1} من {howItWorksSteps.length}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================= WHAT'S INSIDE ======================== */}
        {currentCategory && (
          <section id="whats-inside" className="bg-white py-16 sm:py-24 border-b border-slate-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-[11px] font-bold text-[var(--t-primary)] bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
                  المنهج والمواضيع التعليمية
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight">ما هي الكلمات والموضوعات الموجودة في الكتاب؟</h2>
                <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                  ينظم الكتاب أكثر من 470 كلمة وصوتاً في مواضيع يومية مألوفة، مما يمنح الطفل أساساً عملياً يبني ثقته للتحدث والتعبير باللغة الإنجليزية.
                </p>
              </div>

              <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-2">
                {vocabularyCategories.map((cat) => {
                  const isSelected = cat.id === selectedCategoryId;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`px-4 py-2.5 text-xs font-bold transition-all rounded-full cursor-pointer ${isSelected ? 'bg-[var(--t-primary)] text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                    >
                      {cat.arabic || cat.title}
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 sm:mt-10 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-6 lg:p-8 shadow-xs">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5">
                    <div className="relative rounded-xl overflow-hidden bg-white border border-slate-200 shadow-md">
                      <img
                        src={images[1] || images[0]}
                        alt="الصفحات الداخلية لكتاب الكلمات الإنجليزية التفاعلي"
                        className="w-full h-auto aspect-4/3 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-3.5 bg-white border-t border-slate-100 text-xs text-slate-600">
                        <span className="font-bold text-[var(--t-primary)]">صفحات مصورة ملونة:</span> رسومات كرتونية واضحة تجمع المفاهيم المترابطة معاً في سياق ممتع.
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-2 text-[var(--t-accent)] text-xs font-bold">
                      <Sparkles className="w-4 h-4" />
                      <span>موضوع تعليمي مختار</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[var(--t-primary)] mt-1">{currentCategory.arabic || currentCategory.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{currentCategory.description}</p>

                    <div className="mt-6">
                      <div className="text-[11px] font-bold text-slate-500 mb-3 flex items-center justify-between">
                        <span>نماذج كلمات تفاعلية:</span>
                        <span className="text-[var(--t-accent)] flex items-center gap-1 font-bold text-xs">
                          <Volume2 className="w-3.5 h-3.5" /> اضغط لسماع النطق
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {currentCategory.sampleWords.map((item) => {
                          const isPlaying = playingWord === item.word;
                          return (
                            <button
                              key={item.word}
                              type="button"
                              onClick={() => handleTestSound(item.word)}
                              className={`p-3 sm:p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between cursor-pointer ${isPlaying ? 'bg-red-50 border-[var(--t-accent)] ring-2 ring-red-200 shadow-xs' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                                }`}
                            >
                              <div className="flex items-center justify-between gap-1.5">
                                <span className="font-black text-[var(--t-primary)] text-xs sm:text-sm tracking-wide" dir="ltr">
                                  {item.word} / {item.arabic}
                                </span>
                                <Volume2 className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-[var(--t-accent)] animate-pulse' : 'text-slate-400'}`} />
                              </div>
                              <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 font-mono">
                                <span>{item.phonetic}</span>
                                <span className="text-[10px] font-sans font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{item.category}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>ترتبط الكلمات مباشرة بالأزرار الصوتية حتى يربط الطفل ما يراه في الصفحة بما يسمعه فوراً عبر مكبر الصوت.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ============================= WHY PARENTS BUY ====================== */}
        <section id="benefits" className="bg-slate-50/50 py-16 sm:py-24 border-b border-slate-200/80">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-[11px] font-bold text-[var(--t-primary)] bg-white border border-slate-200 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
                مصمم بعناية للأولياء والأطفال
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight">لماذا يفضل الأولياء هذا الكتاب الصوتي؟</h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
                فوائد عملية تجعل ممارسة اللغة الإنجليزية أهدأ، وأكثر متعة، وبدون شاشات إلكترونية على الإطلاق.
              </p>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-md">
                  <div className="aspect-4/3 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80">
                    <img src={images[2] || images[0]} alt="طفل يستكشف كتاب الكلمات الإنجليزية التفاعلي بمفرده" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="pt-4 sm:pt-5">
                    <div className="text-[11px] font-bold text-[var(--t-accent)]">نشاط تعليمي بديل للشاشات</div>
                    <div className="text-sm sm:text-base font-black text-[var(--t-primary)] mt-1">تفاعل حقيقي باليد والذهن دون إجهاد العين بالشاشات</div>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      مثالي لأوقات اللعب الهادئة في البيت، أو خلال السفر والرحلات في السيارة دون الحاجة لتشغيل الهاتف.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 order-1 lg:order-2 space-y-3.5">
                {whyParentsBuy.map((benefit: any, idx: number) => {
                  const Icon = benefitIcons[idx] || Sparkles;
                  return (
                    <div key={idx} className="flex items-start gap-4 p-4 sm:p-4.5 bg-white border border-slate-200/90 rounded-2xl hover:border-slate-300 hover:shadow-xs transition-all">
                      <div className="w-11 h-11 rounded-xl bg-[var(--t-primary)] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Icon className="w-5 h-5 text-[var(--t-accent)]" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-[var(--t-primary)]">{benefit.title}</h3>
                        <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============================= REVIEWS (optional) =================== */}
        {reviewsList && (
          <section className="bg-white py-16 sm:py-20 border-b border-slate-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--t-primary)]">تقييمات العملاء (Avis Clients)</h2>
                  <p className="text-xs sm:text-sm text-slate-500">آراء حقيقية من أولياء الأمور بعد استخدام الكتاب</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                  <div className="text-2xl font-black text-[var(--t-primary)]">4.9</div>
                  <div>
                    <div className="flex text-[var(--t-accent)]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[var(--t-accent)]" />
                      ))}
                    </div>
                    <div className="text-[10px] text-slate-500">من أصل 5 نجوم</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewsList.map((rev: any, idx: number) => (
                  <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-full bg-[var(--t-primary)] text-[var(--t-accent)] font-bold text-xs flex items-center justify-center">
                          {rev.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[var(--t-primary)]">{rev.name}</div>
                          {rev.location && <div className="text-[11px] text-slate-500">{rev.location}</div>}
                        </div>
                      </div>
                      <div className="flex text-[var(--t-accent)]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[var(--t-accent)]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">"{rev.text}"</p>
                    <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 pt-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>طلب مؤكد وتوصيل مستلم (Achat Vérifié)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ========================= SOCIAL PROOF (optional) =================== */}
        {socialProofList && (
          <section className="bg-slate-50/50 py-16 sm:py-20 border-b border-slate-200/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--t-primary)]">تجارب الأولياء وأطفالهم</h2>
                <p className="text-sm text-slate-600">صور وفيديوهات وتسجيلات صوتية حقيقية شاركها أولياء بعد استلام طلبياتهم</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {socialProofList.map((item: any, idx: number) => (
                  <div key={idx} className="bg-white flex flex-col items-center justify-center rounded-2xl border border-slate-200 p-3 shadow-xs space-y-3">
                    {item.type === 'audio' ? (
                      <div className="bg-red-50/60 p-4 rounded-xl border border-red-200 space-y-3 w-full">
                        <div className="flex items-center justify-between text-xs font-bold text-[var(--t-accent)]">
                          <span className="flex items-center gap-1.5">
                            <Volume2 className="w-4 h-4" />
                            <span>تسجيل صوتي</span>
                          </span>
                        </div>
                        <VoiceNotePlayer src={item.url || ''} playingAudioSrc={playingAudioSrc} onPlay={setPlayingAudioSrc} onPause={() => setPlayingAudioSrc(null)} />
                        {item.caption && <p className="text-[11px] text-slate-500 italic text-center">{item.caption}</p>}
                      </div>
                    ) : item.type === 'video' ? (
                      <div className="w-full space-y-2">
                        <SocialProofVideo src={item.url} className="aspect-square rounded-xl" fill />
                        {item.caption && <p className="text-xs text-slate-600 font-medium text-center line-clamp-2">{item.caption}</p>}
                      </div>
                    ) : (
                      <div className="space-y-2 w-full">
                        <div className="aspect-square rounded-xl overflow-hidden cursor-pointer relative group" onClick={() => item.url && setLightboxImage(item.url)}>
                          <img src={item.url || images[0]} alt="صورة تجربة" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        {item.caption && <p className="text-xs text-slate-600 font-medium text-center line-clamp-2">{item.caption}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ============================= FAQ =================================== */}
        <section id="faq" className="bg-white py-16 sm:py-24 border-b border-slate-200/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center">
              <span className="text-[11px] font-bold text-[var(--t-primary)] bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full inline-block mb-3 shadow-2xs">
                إجابات لجميع تساؤلات الأولياء
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--t-primary)] tracking-tight">الأسئلة الشائعة وتفاصيل الاستخدام</h2>
              <p className="mt-3.5 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                معلومات واضحة ومباشرة حول الكتاب، طريقة تشغيل الأصوات، الشحن، والدفع عند الاستلام.
              </p>
            </div>

            <div className="mt-10 sm:mt-12 space-y-3">
              {faqItems.map((faq: any, index: number) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className={`rounded-2xl border transition-all ${isOpen ? 'border-slate-300 bg-slate-50/60 shadow-xs' : 'border-slate-200/90 bg-white hover:border-slate-300'}`}>
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-right p-5 gap-4 group focus:outline-none cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-black text-[var(--t-primary)] group-hover:text-[var(--t-accent)] transition-colors">{faq.question}</span>
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-[var(--t-accent)] text-white border-[var(--t-accent)]' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/50 mt-1 pt-3">{faq.answer}</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100/70 text-[var(--t-accent)] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="font-bold text-[var(--t-primary)]">هل لديك أي استفسار إضافي قبل تأكيد طلبك؟</span>
              </div>
              <span className="text-xs text-slate-500 text-center sm:text-left">يتصل بكم موظف التأكيد هاتفياً لمراجعة أي تفاصيل قبل شحن الطرد.</span>
            </div>
          </div>
        </section>

        {/* ============================= ORDER / CHECKOUT ====================== */}
        <section id='order-section'>
          <KidsOrderForm
            pageId={page?.id}
            clientId={client?.id}
            pageSlug={client?.slug}
            productName={productName}
            price={price}
            primaryColor={page?.page_config?.primaryColor || "#ca3aabff"}
          />
        </section>
      </main>

      {/* ============================= FOOTER ================================ */}
      <footer className="bg-[var(--t-primary)] text-slate-400 py-14 text-xs sm:text-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-10 pb-10 border-b border-slate-800">
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5 text-white">
                <div className="w-9 h-9 rounded-xl bg-[var(--t-accent)] text-white flex items-center justify-center font-bold shadow-xs">
                  <Volume2 className="w-5 h-5" />
                </div>
                <span className="font-black text-base tracking-tight text-white">{client.business_name || productName}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                كتاب تعليمي صوتي تفاعلي يساعد الأطفال على اكتشاف ونطق الكلمات الإنجليزية الأولى بوضوح وسلاسة عبر أزرار حسية ورسومات ملونة، بدون الحاجة لشاشات إلكترونية.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-2 font-medium bg-slate-800/60 px-3 py-1.5 rounded-full">
                  <Truck className="w-4 h-4 text-[var(--t-accent)]" />
                  <span>توصيل سريع لـ 58 ولاية</span>
                </span>
                <span className="flex items-center gap-2 font-medium bg-slate-800/60 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>الدفع عند الاستلام</span>
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">روابط سريعة</h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-white uppercase tracking-wider mb-4">خدمة العملاء وتأكيد الطلبات</h4>
              <div className="space-y-3 text-xs sm:text-sm">
                <p className="text-slate-400 leading-relaxed">يتم الاتصال بكم هاتفياً لتأكيد العنوان وبيانات التوصيل قبل إرسال الطرد مع شركة الشحن.</p>
                <div className="pt-2 text-slate-300 space-y-1 text-xs font-medium">
                  <p>أوقات العمل: السبت إلى الخميس (09:00 - 18:00)</p>
                  <p>التغطية: كامل الـ 58 ولاية جزائرية</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} {client.business_name || productName}. جميع الحقوق محفوظة.</p>
            <p className="text-xs font-medium text-slate-400">الدفع عند الاستلام (Paiement à la livraison) • فحص المنتج قبل الدفع</p>
          </div>
        </div>
      </footer>

      {/* ===================== STICKY MOBILE ORDER BAR ======================= */}
      {stickyBarVisible && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--t-primary)]/95 backdrop-blur-md border-t border-slate-700/80 px-3.5 py-2.5 shadow-2xl transition-all">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-base sm:text-lg font-black text-white leading-none">{price.toLocaleString()} DA</span>

              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-300 mt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="truncate">الدفع عند الاستلام نقداً</span>
              </div>
            </div>
            <button
              type="button"
              onClick={scrollToOrderForm}
              className="bg-[var(--t-accent)] hover:brightness-110 text-white text-xs sm:text-sm font-black px-5 py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer shrink-0 min-h-[44px]"
            >
              <span>اطلب الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================= LIGHTBOX =============================== */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setLightboxImage(null)}>
          <div className="relative max-w-4xl w-full max-h-[90vh]">
            <img src={lightboxImage} alt="صورة مكبرة" className="w-full h-full object-contain rounded-2xl" />
            <button onClick={() => setLightboxImage(null)} className="absolute top-2 left-2 bg-white/20 text-white p-2 rounded-full backdrop-blur-md">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
