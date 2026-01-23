# coding: utf-8

Gem::Specification.new do |spec|
  spec.name          = "jekyll-xda-theme"
  spec.version       = "3.0.0"
  spec.authors       = ["thianda"]
  spec.email         = ["thianda91@outlook.com"]

  spec.summary       = %q{A super customizable Jekyll theme for personal site, team site, blog, project, documentation, etc.}
  spec.homepage      = "https://github.com/thianda91/jekyll-xda-theme"
  spec.license       = "MIT"

  spec.metadata["plugin_type"] = "theme"

  spec.files         = `git ls-files -z`.split("\x0").select do |f|
    f.match(%r{^((_data|_includes|_layouts|_sass|assets)/|(LICENSE|README|CHANGELOG)((\.(txt|md|markdown)|$)))}i)
  end

  spec.add_runtime_dependency "jekyll"
  spec.add_runtime_dependency "jekyll-paginate"
  spec.add_runtime_dependency "jekyll-sitemap"
  spec.add_runtime_dependency "jekyll-feed"
  spec.add_runtime_dependency "tzinfo-data"
  spec.add_runtime_dependency "jemoji"

  spec.add_development_dependency "bundler"
  spec.add_development_dependency "rake"
end
