export class GaleriKegiatanQueryDTO {
    page: number;
    pageSize: number;
    search?: string;
    status?: number;

    constructor(
        page: number = 1,
        pageSize: number = 10,
        search?: string,
        status?: number,
    ) {
        this.page = page;
        this.pageSize = pageSize;
        this.search = search;
        this.status = status;
    }
}
