.PHONY: dev test build lint clean docker setup logs health cost swarm

setup:
	npm.cmd install
	cp .env.example .env || copy .env.example .env
	npx prisma migrate deploy
	node scripts/seed-agentdb.js
	npm.cmd run swarm:init
	@echo "FORGEMIND ready. Edit .env then run: make dev"

dev:
	npm.cmd run dev

build:
	npm.cmd run build

test:
	npm.cmd run test:coverage

lint:
	npm.cmd run lint:fix

clean:
	rm -rf dist coverage node_modules/.cache

docker:
	docker-compose -f docker/docker-compose.yml up --build

logs:
	npm.cmd run logs:success
	npm.cmd run logs:fail

health:
	node scripts/health-check.js

cost:
	node scripts/cost-report.js

swarm:
	npm.cmd run swarm:start
	npm.cmd run swarm:status
