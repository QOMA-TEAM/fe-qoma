export interface OutletInfo {
  id: string;
  nama_outlet: string;
  alamat: string;
  gambar_icon?: string | null;
  gambar_header?: string | null;
}

export interface MejaInfo {
  id: string;
  nomor_meja: string;
}

export interface ValidasiMejaResponse {
  message: string;
  data: {
    outlet: OutletInfo;
    meja: MejaInfo;
  };
}

export interface KategoriInfo {
  id: string;
  nama: string;
}

export interface PublicMenuItem {
  id: string;
  nama: string;
  kategori: string;
  kategori_id: string;
  harga: number;
  gambar: string | null;
  keterangan: string;
  is_available: boolean;
  bahan_baku: {
    nama: string;
    satuan: string;
  }[];
}

export interface MenuPerKategori {
  kategori: string;
  items: PublicMenuItem[];
}

export interface PublicMenuResponse {
  message: string;
  data: {
    outlet: OutletInfo;
    kategoris: KategoriInfo[];
    menu_per_kategori: MenuPerKategori[];
    total_menu: number;
  };
}

export interface PublicAddon {
  id: string;
  nama: string;
  harga: number;
}

export interface PublicMenuDetail {
  id: string;
  nama: string;
  kategori: string;
  harga: number;
  harga_dasar: number;
  gambar: string | null;
  keterangan: string;
  addons_tersedia: PublicAddon[];
}

export interface PublicMenuDetailResponse {
  message: string;
  data: PublicMenuDetail;
}
