/**
 * API Response Helper Functions
 * Backend'deki Response.cs ve PagedResponse.cs yapısına uygun
 */

/**
 * Başarılı yanıt oluşturur
 * @param {any} data - Yanıt verisi
 * @param {string} message - Başarı mesajı
 * @returns {Response} JSON Response
 */
export function successResponse(data, message = "İşlem başarılı") {
    return Response.json({
        success: true,
        message,
        data,
        errors: null
    }, { status: 200 });
}

/**
 * Oluşturma başarılı yanıtı (201)
 * @param {any} data - Oluşturulan veri
 * @param {string} message - Başarı mesajı
 * @returns {Response} JSON Response
 */
export function createdResponse(data, message = "Kayıt başarıyla oluşturuldu") {
    return Response.json({
        success: true,
        message,
        data,
        errors: null
    }, { status: 201 });
}

/**
 * Hata yanıtı oluşturur
 * @param {string} message - Hata mesajı
 * @param {number} status - HTTP durum kodu
 * @param {object} errors - Detaylı hatalar
 * @returns {Response} JSON Response
 */
export function errorResponse(message, status = 400, errors = null) {
    return Response.json({
        success: false,
        message,
        data: null,
        errors
    }, { status });
}

/**
 * Sayfalanmış yanıt oluşturur
 * @param {Array} data - Veri listesi
 * @param {number} page - Sayfa numarası
 * @param {number} pageSize - Sayfa başına öğe
 * @param {number} totalCount - Toplam öğe sayısı
 * @returns {Response} JSON Response
 */
export function pagedResponse(data, page, pageSize, totalCount) {
    const totalPages = Math.ceil(totalCount / pageSize);

    return Response.json({
        success: true,
        message: "İşlem başarılı",
        data: {
            data,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasPreviousPage: page > 1,
            hasNextPage: page < totalPages
        },
        errors: null
    }, { status: 200 });
}

/**
 * Yetkilendirme hatası (401)
 * @param {string} message - Hata mesajı
 * @returns {Response} JSON Response
 */
export function unauthorizedResponse(message = "Yetkilendirme başarısız") {
    return errorResponse(message, 401);
}

/**
 * Yetkisiz erişim (403)
 * @param {string} message - Hata mesajı
 * @returns {Response} JSON Response
 */
export function forbiddenResponse(message = "Bu işlem için yetkiniz yok") {
    return errorResponse(message, 403);
}

/**
 * Bulunamadı hatası (404)
 * @param {string} message - Hata mesajı
 * @returns {Response} JSON Response
 */
export function notFoundResponse(message = "Kayıt bulunamadı") {
    return errorResponse(message, 404);
}

/**
 * Validasyon hatası (422)
 * @param {object} errors - Validasyon hataları
 * @returns {Response} JSON Response
 */
export function validationErrorResponse(errors) {
    return Response.json({
        success: false,
        message: "Validasyon hatası",
        data: null,
        errors
    }, { status: 422 });
}
