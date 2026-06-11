export interface OutletInfo {
  id: string;
  nama_outlet: string;
  alamat: string;
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
