package config

import (
	"flag"
	"log"
	"os"

	"github.com/ilyakaznacheev/cleanenv"
)

type HTTPServer struct {
	Addr string
}
type Config struct {
	Env         string `yaml:"env" env:"ENV" env-required:"true" `
	StoragePath string `yaml:"storage_path" env-required:"true"`
	HTTPServer  `yaml:"http_server"`
}

func MustLoad() *Config {
	// Load configuration from environment variables or default values
	// If loading fails, the application should panic
	var configPath string
	configPath = os.Getenv("CONFIG_PATH")
	if configPath == "" {
		flags := flag.String("Config", "", "path to the config file")
		flag.Parse() // parse all flags to config path
		configPath = *flags

		if configPath == "" {
			// still empty then
			log.Fatal("Config path is not set")
		}
	}
	if _, err := os.Stat(configPath); os.IsNotExist(err) {
		log.Fatalf("Config file does not exist at path: %s", configPath)
	}
	var cfg Config
	err := cleanenv.ReadConfig(configPath, &cfg) //it will return error

	if err != nil {
		log.Fatalf("can't read config files %s", err.Error())
	}
	return  &cfg
}
