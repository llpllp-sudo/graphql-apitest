function fn() {
    var env = karate.env; // get system property 'karate.env'
    java.lang.System.out.println('>>> KARATE CONFIG LOADED. env: ' + env);
    if (!env) {
        env = 'dev'; // defaults to 'dev'
    }

    var config = {
        env: env,
        apiUrl: 'https://spacex-production.up.railway.app/'
    };

    // set connection/read timeouts if needed
    karate.configure('connectTimeout', 5000);
    karate.configure('readTimeout', 5000);

    return config;
}
