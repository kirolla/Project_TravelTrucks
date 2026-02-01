import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://66b1f8e71ca8ad33d4f5f63e.mockapi.io/campers';

const loadFavoritesFromStorage = () => {
    try {
        const favorites = localStorage.getItem('campers_favorites');
        return favorites ? JSON.parse(favorites) : [];
    } catch {
        return [];
    }
};

const saveFavoritesToStorage = (favorites) => {
    localStorage.setItem('campers_favorites', JSON.stringify(favorites));
};

const buildQueryParams = (filters) => {
    const params = {};

    if (filters?.location && filters.location.trim() !== '') {
        params.location = filters.location.trim();
    }


    if (filters?.vehicleType) {
        params.form = filters.vehicleType;
    }

    const equipmentMap = {
        AC: "AC",
        automatic: "transmission",
        kitchen: "kitchen",
        TV: "TV",
        bathroom: "bathroom",
        radio: "radio",
        refrigerator: "refrigerator",
        microwave: "microwave",
        gas: "gas",
        water: "water",
    };

    if (filters?.equipment && Array.isArray(filters.equipment)) {
        filters.equipment.forEach(eq => {
            const apiKey = equipmentMap[eq];

            if (eq === "automatic") {

                params[apiKey] = "automatic";
            } else if (apiKey) {

                params[apiKey] = true;
            }
        });
    }

    console.log("📡 API Query Params:", params);
    return params;
};

export const fetchCampers = createAsyncThunk(
    'campers/fetchCampers',
    async (filters = null, { rejectWithValue }) => {
        try {
            const params = buildQueryParams(filters);
            console.log("🔍 Fetching from:", API_URL, "with params:", params);

            const response = await axios.get(API_URL, { params });

            let campersArray = [];
            if (Array.isArray(response.data)) {
                campersArray = response.data;
            } else if (response.data && typeof response.data === 'object') {
                campersArray = response.data.data ||
                    response.data.items ||
                    response.data.campers ||
                    [];
            }

            console.log("✅ Received campers:", campersArray.length);
            return campersArray;
        } catch (error) {
            console.error('❌ Error fetching campers:', error.response?.data || error.message);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch campers'
            );
        }
    }
);

export const fetchCamperById = createAsyncThunk(
    'campers/fetchCamperById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching camper by ID:', error);
            return rejectWithValue(error.message || 'Failed to fetch camper details');
        }
    }
);

const initialState = {
    items: [],
    currentCamper: null,
    favorites: loadFavoritesFromStorage(),
    visibleCount: 4,
    loading: false,
    error: null,
    searchPerformed: false,
};

const campersSlice = createSlice({
    name: 'campers',
    initialState,
    reducers: {
        toggleFavorite: (state, action) => {
            const camperId = action.payload;
            const index = state.favorites.indexOf(camperId);

            if (index === -1) {
                state.favorites.push(camperId);
            } else {
                state.favorites.splice(index, 1);
            }

            saveFavoritesToStorage(state.favorites);
        },
        clearCurrentCamper: (state) => {
            state.currentCamper = null;
        },
        loadMore: (state) => {
            state.visibleCount += 4;
        },
        resetVisibleCount: (state) => {
            state.visibleCount = 4;
        },
        clearSearchResults: (state) => {
            state.items = [];
            state.visibleCount = 4;
            state.searchPerformed = true;
        },
        resetSearch: (state) => {
            state.searchPerformed = false;
            state.visibleCount = 4;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCampers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCampers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
                state.searchPerformed = true;
                state.visibleCount = 4;
                console.log("📊 Updated state with items:", action.payload.length);
            })
            .addCase(fetchCampers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.searchPerformed = true;
            })
            .addCase(fetchCamperById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCamperById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCamper = action.payload;
            })
            .addCase(fetchCamperById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    toggleFavorite,
    clearCurrentCamper,
    loadMore,
    resetVisibleCount,
    clearSearchResults,
    resetSearch,
} = campersSlice.actions;

export default campersSlice.reducer;