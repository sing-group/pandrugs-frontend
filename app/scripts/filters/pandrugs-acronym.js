/*
 * PanDrugs Frontend
 *
 * Copyright (C) 2015 - 2017 Fátima Al-Shahrour, Elena Piñeiro,
 * Daniel Glez-Peña and Miguel Reboiro-Jato
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 */
'use strict';

/**
 * @ngdoc filter
 * @name pandrugsFrontendApp.filter:pandrugsAcronym
 * @description
 * # pandrugs-acronym
 * Returns the acronym of some PanDrugs vocabulary.
 */
angular.module('pandrugsFrontendApp')
    .filter('pandrugsAcronym', function () {
        var acronyms = {
            'approved': 'AP',
            'clinical trials': 'CT',
            'experimental': 'EX',
            'targeted therapy': 'TT',
            'chemotherapy': 'CTx',
            'combination therapy': 'CbT',
            'hormone therapy': 'HT',
            'immunotherapy': 'IT',
            'photodynamic therapy': 'PdT',
            'other therapy': 'OT',
            'direct target': 'DT',
            'biomarker': 'BM',
            'pathway member': 'PM',
            'genetic dependency': 'GD',
            'gene dependency': 'GD',
            'drug score': 'DS',
            'gene score': 'GS',
            'overexpressed': 'Up',
            'underexpressed': 'Down',
            'highly overexpressed': 'Up'
        };

        return function (input) {
            var lowercase = input.toLowerCase();
            return acronyms[lowercase] ? acronyms[lowercase] : input;
        };
    });
