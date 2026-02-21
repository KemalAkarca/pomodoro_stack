// Bu dosya Task tipini tek bir yerde tutar.
// Böylece her component aynı tipi kullanır (tekrar yok).

export type Task = {
  id: string;     // benzersiz id
  title: string;  // task metni
  done: boolean;  // tamamlandı mı?
};
