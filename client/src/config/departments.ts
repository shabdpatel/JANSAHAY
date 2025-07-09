export const departmentConfig = {
    collections: {
        'publicwork': [
            'potholeissues',
            'roadissues',
            'drainissues',
            'bridgeissues',
            'sidewalkissues',
            'constructionissues'
        ],
        'sanitation': [
            'garbageissues',
            'cleaningissues',
            'recyclingissues',
            'dumpsterissues',
            'compostissues',
            'litterissues'
        ],
        'electricity': [
            'streetlightissues',
            'powerissues',
            'outageissues',
            'wiringissues',
            'transformerissues',
            'meterissues'
        ],
        'water': [
            'waterleakissues',
            'drainageissues',
            'sewerissues',
            'floodingissues',
            'qualityissues',
            'meterissues'
        ],
        'parks': [
            'parkissues',
            'playgroundissues',
            'treeissues',
            'grassissues',
            'benchissues',
            'fountainissues'
        ],
        'transportation': [
            'trafficissues',
            'signissues',
            'signalissues',
            'parkingissues',
            'busissues',
            'bikeissues'
        ],
        'health': [
            'mosquitoissues',
            'rodentissues',
            'sanitationissues',
            'restaurantissues',
            'vaccineissues',
            'clinicissues'
        ],
        'police': [
            'safetyissues',
            'trafficissues',
            'patrolissues',
            'parkingissues',
            'noiseissues',
            'crimeissues'
        ],
        'fire': [
            'hydrantissues',
            'safetyissues',
            'alarmissues',
            'accessissues',
            'hazardissues',
            'inspectionissues'
        ],
        'animal': [
            'strayissues',
            'wildlifeissues',
            'dogissues',
            'noiseissues',
            'biteissues',
            'shelterissues'
        ],
        'building': [
            'permitissues',
            'codeissues',
            'safetyissues',
            'constructionissues',
            'inspectionissues',
            'zoningissues'
        ],
        'environment': [
            'pollutionissues',
            'recyclingissues',
            'treeissues',
            'airqualityissues',
            'noiseissues',
            'sustainabilityissues'
        ]
    } as Record<string, string[]>,

    getCollectionsForDepartment: (dept: string): string[] => {
        const normalizedDept = dept.toLowerCase()
            .replace('works', 'work')
            .replace('ies', 'y')
            .replace('services', 'service')
            .replace('authorities', 'authority');
        return departmentConfig.collections[normalizedDept] || [];
    },

    getDepartmentFromEmail: (email: string): string | null => {
        const adminMatch = email.toLowerCase().match(/^admin\.([a-z]+)@/i);
        if (!adminMatch) return null;

        const dept = adminMatch[1]
            .replace('works', 'work')
            .replace('ies', 'y')
            .replace('services', 'service')
            .replace('authorities', 'authority');

        return dept;
    }
};