/**
 * Admin Meal Service - Yemek yönetimi için admin API fonksiyonları
 */

import { get, post, put, del } from './api-client';

// ============ YEMEKHANELER (Cafeterias) ============

/**
 * Yemekhane listesi getir
 * Backend: GET /api/v1/Cafeterias
 */
export async function getCafeterias(includeInactive = false) {
    return await get(`/Cafeterias?includeInactive=${includeInactive}`);
}

/**
 * Yemekhane detayı getir
 * Backend: GET /api/v1/Cafeterias/{id}
 */
export async function getCafeteriaById(id) {
    return await get(`/Cafeterias/${id}`);
}

/**
 * Yeni yemekhane oluştur
 * Backend: POST /api/v1/Cafeterias
 */
export async function createCafeteria(data) {
    return await post('/Cafeterias', data);
}

/**
 * Yemekhane güncelle
 * Backend: PUT /api/v1/Cafeterias/{id}
 */
export async function updateCafeteria(id, data) {
    return await put(`/Cafeterias/${id}`, data);
}

/**
 * Yemekhane sil
 * Backend: DELETE /api/v1/Cafeterias/{id}
 */
export async function deleteCafeteria(id) {
    return await del(`/Cafeterias/${id}`);
}

// ============ YEMEK İÇERİKLERİ (Food Items) ============

/**
 * Yemek içerikleri listesi getir
 * Backend: GET /api/v1/FoodItems
 */
export async function getFoodItems(includeInactive = false) {
    return await get(`/FoodItems?includeInactive=${includeInactive}`);
}

/**
 * Kategoriye göre yemek içerikleri getir
 * Backend: GET /api/v1/FoodItems/category/{category}
 */
export async function getFoodItemsByCategory(category) {
    return await get(`/FoodItems/category/${category}`);
}

/**
 * Yemek içeriği detayı getir
 * Backend: GET /api/v1/FoodItems/{id}
 */
export async function getFoodItemById(id) {
    return await get(`/FoodItems/${id}`);
}

/**
 * Yeni yemek içeriği oluştur
 * Backend: POST /api/v1/FoodItems
 * @param {object} data - { Name, Description, Category, Calories }
 */
export async function createFoodItem(data) {
    return await post('/FoodItems', data);
}

/**
 * Yemek içeriği güncelle
 * Backend: PUT /api/v1/FoodItems/{id}
 */
export async function updateFoodItem(id, data) {
    return await put(`/FoodItems/${id}`, data);
}

/**
 * Yemek içeriği sil
 * Backend: DELETE /api/v1/FoodItems/{id}
 */
export async function deleteFoodItem(id) {
    return await del(`/FoodItems/${id}`);
}

// ============ MENÜLER (Meal Menus) ============

/**
 * Menü listesi getir
 * Backend: GET /api/v1/MealMenus
 */
export async function getMenus(params = {}) {
    const queryParams = new URLSearchParams();
    if (params.date) queryParams.append('date', params.date);
    if (params.cafeteriaId) queryParams.append('cafeteriaId', params.cafeteriaId);
    if (params.mealType) queryParams.append('mealType', params.mealType);

    const queryString = queryParams.toString();
    return await get(`/MealMenus${queryString ? `?${queryString}` : ''}`);
}

/**
 * Menü detayı getir
 * Backend: GET /api/v1/MealMenus/{id}
 */
export async function getMenuById(id) {
    return await get(`/MealMenus/${id}`);
}

/**
 * Yeni menü oluştur
 * Backend: POST /api/v1/MealMenus
 * @param {object} data - { CafeteriaId, Date, MealType, Price, IsPublished, FoodItemIds }
 */
export async function createMenu(data) {
    return await post('/MealMenus', data);
}

/**
 * Menü güncelle
 * Backend: PUT /api/v1/MealMenus/{id}
 */
export async function updateMenu(id, data) {
    return await put(`/MealMenus/${id}`, data);
}

/**
 * Menü sil
 * Backend: DELETE /api/v1/MealMenus/{id}
 */
export async function deleteMenu(id, force = false) {
    return await del(`/MealMenus/${id}?force=${force}`);
}

/**
 * Menüyü yayınla
 * Backend: PUT /api/v1/MealMenus/{id}/publish
 */
export async function publishMenu(id) {
    return await put(`/MealMenus/${id}/publish`);
}

/**
 * Menü yayınını geri çek
 * Backend: PUT /api/v1/MealMenus/{id}/unpublish
 */
export async function unpublishMenu(id) {
    return await put(`/MealMenus/${id}/unpublish`);
}

/**
 * Menüye yemek içeriği ekle
 * Backend: POST /api/v1/MealMenus/{menuId}/items/{foodItemId}
 */
export async function addFoodItemToMenu(menuId, foodItemId) {
    return await post(`/MealMenus/${menuId}/items/${foodItemId}`);
}

/**
 * Menüden yemek içeriği çıkar
 * Backend: DELETE /api/v1/MealMenus/{menuId}/items/{foodItemId}
 */
export async function removeFoodItemFromMenu(menuId, foodItemId) {
    return await del(`/MealMenus/${menuId}/items/${foodItemId}`);
}

// ============ ENUM DEĞERLERİ ============

export const MealType = {
    Breakfast: 1,
    Lunch: 2,
    Dinner: 3
};

export const MealTypeLabels = {
    1: 'Kahvaltı',
    2: 'Öğle Yemeği',
    3: 'Akşam Yemeği'
};

export const MealItemCategory = {
    Soup: 1,
    MainCourse: 2,
    SideDish: 3,
    Salad: 4,
    Beverage: 5,
    Dessert: 6,
    Appetizer: 7
};

export const MealItemCategoryLabels = {
    1: 'Çorba',
    2: 'Ana Yemek',
    3: 'Yan Yemek',
    4: 'Salata',
    5: 'İçecek',
    6: 'Tatlı',
    7: 'Meze'
};

export default {
    // Cafeterias
    getCafeterias,
    getCafeteriaById,
    createCafeteria,
    updateCafeteria,
    deleteCafeteria,
    // Food Items
    getFoodItems,
    getFoodItemsByCategory,
    getFoodItemById,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
    // Menus
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu,
    publishMenu,
    unpublishMenu,
    addFoodItemToMenu,
    removeFoodItemFromMenu,
    // Enums
    MealType,
    MealTypeLabels,
    MealItemCategory,
    MealItemCategoryLabels
};
