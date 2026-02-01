import { createSlice } from '@reduxjs/toolkit';

const loadFiltersFromStorage = () => {
    try {
        const filters = localStorage.getItem('camper_filters');
        return filters ? JSON.parse(filters) : null;
    } catch {
        return null;
    }
};

const saveFiltersToStorage = (filters) => {
    localStorage.setItem('camper_filters', JSON.stringify(filters));
};

const savedFilters = loadFiltersFromStorage();

const initialState = {
    location: savedFilters?.location || '',
    vehicleType: savedFilters?.vehicleType || null,
    equipment: savedFilters?.equipment || [],
};

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setLocation: (state, action) => {
            console.log("📍 Setting location:", action.payload);
            state.location = action.payload;
            saveFiltersToStorage({
                location: state.location,
                vehicleType: state.vehicleType,
                equipment: state.equipment,
            });
        },
        setVehicleType: (state, action) => {
            console.log("🚐 Setting vehicle type:", action.payload);
            state.vehicleType = action.payload;
            saveFiltersToStorage({
                location: state.location,
                vehicleType: state.vehicleType,
                equipment: state.equipment,
            });
        },
        toggleEquipment: (state, action) => {
            const id = action.payload;
            console.log("🔧 Toggling equipment:", id);

            const index = state.equipment.indexOf(id);
            if (index === -1) {
                state.equipment.push(id);
            } else {
                state.equipment.splice(index, 1);
            }

            console.log("📋 Current equipment:", state.equipment);

            saveFiltersToStorage({
                location: state.location,
                vehicleType: state.vehicleType,
                equipment: state.equipment,
            });
        },
        resetFilters: (state) => {
            console.log("🗑️ Resetting all filters");
            state.location = '';
            state.vehicleType = null;
            state.equipment = [];
            localStorage.removeItem('camper_filters');
        },
    },
});

export const { setLocation, setVehicleType, toggleEquipment, resetFilters } = filtersSlice.actions;

export default filtersSlice.reducer;