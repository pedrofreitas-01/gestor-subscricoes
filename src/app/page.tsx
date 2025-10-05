"use client"

import { useState, useEffect } from 'react'
import { Plus, Trash2, Calendar, DollarSign, TrendingDown, Bell, Users, Tv, Music, ShoppingBag, Star } from 'lucide-react'

interface Subscription {
  id: string
  name: string
  price: number
  renewalDate: string
  category: string
  icon: string
  color: string
}

const predefinedServices = [
  { name: 'Netflix', price: 45.90, category: 'Streaming', icon: 'Tv', color: 'bg-red-500' },
  { name: 'Spotify', price: 21.90, category: 'Música', icon: 'Music', color: 'bg-green-500' },
  { name: 'Amazon Prime', price: 14.90, category: 'Streaming', icon: 'ShoppingBag', color: 'bg-blue-500' },
  { name: 'Disney+', price: 33.90, category: 'Streaming', icon: 'Star', color: 'bg-purple-500' },
  { name: 'YouTube Premium', price: 24.90, category: 'Streaming', icon: 'Tv', color: 'bg-red-600' },
  { name: 'Apple Music', price: 21.90, category: 'Música', icon: 'Music', color: 'bg-gray-800' }
]

const economyTips = [
  {
    title: "Compartilhe contas familiares",
    description: "Divida o custo de planos familiares com amigos ou família",
    savings: "Até 70% de economia"
  },
  {
    title: "Cancele serviços não utilizados",
    description: "Revise mensalmente quais serviços você realmente usa",
    savings: "€ 50-200/mês"
  },
  {
    title: "Aproveite promoções anuais",
    description: "Muitos serviços oferecem desconto para pagamento anual",
    savings: "10-20% de desconto"
  },
  {
    title: "Alterne entre serviços",
    description: "Assine apenas um serviço por vez, alternando conforme o conteúdo",
    savings: "Até 60% de economia"
  }
]

export default function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    price: '',
    renewalDate: '',
    category: 'Streaming'
  })

  // Carregar dados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('subscriptions')
    if (saved) {
      setSubscriptions(JSON.parse(saved))
    }
  }, [])

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions))
  }, [subscriptions])

  // Calcular total mensal
  const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0)
  const totalYearly = totalMonthly * 12

  // Verificar renovações próximas (próximos 7 dias)
  const upcomingRenewals = subscriptions.filter(sub => {
    const renewalDate = new Date(sub.renewalDate)
    const today = new Date()
    const diffTime = renewalDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays >= 0
  })

  const addSubscription = () => {
    if (!newSubscription.name || !newSubscription.price || !newSubscription.renewalDate) return

    const predefined = predefinedServices.find(s => s.name === newSubscription.name)
    
    const subscription: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.name,
      price: parseFloat(newSubscription.price),
      renewalDate: newSubscription.renewalDate,
      category: newSubscription.category,
      icon: predefined?.icon || 'Tv',
      color: predefined?.color || 'bg-gray-500'
    }

    setSubscriptions([...subscriptions, subscription])
    setNewSubscription({ name: '', price: '', renewalDate: '', category: 'Streaming' })
    setShowAddForm(false)
  }

  const removeSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id))
  }

  const getIcon = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Tv, Music, ShoppingBag, Star
    }
    const IconComponent = icons[iconName] || Tv
    return <IconComponent className="w-6 h-6 text-white" />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Gestor de Subscrições
          </h1>
          <p className="text-gray-600 text-lg">
            Controle seus gastos com streaming e serviços digitais
          </p>
        </div>

        {/* Alertas de Renovação */}
        {upcomingRenewals.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Renovações Próximas</h3>
            </div>
            <div className="space-y-2">
              {upcomingRenewals.map(sub => (
                <div key={sub.id} className="flex justify-between items-center text-sm">
                  <span className="text-amber-700">{sub.name}</span>
                  <span className="text-amber-600 font-medium">
                    {new Date(sub.renewalDate).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Gasto Mensal</p>
                <p className="text-2xl font-bold text-gray-900">
                  € 240.00
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Gasto Anual</p>
                <p className="text-2xl font-bold text-gray-900">
                  € {totalYearly.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Serviços Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscriptions.length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Tv className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Subscrições */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Suas Subscrições
                  </h2>
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Formulário de Adicionar */}
                {showAddForm && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Nova Subscrição</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Serviço
                        </label>
                        <select
                          value={newSubscription.name}
                          onChange={(e) => {
                            const selected = predefinedServices.find(s => s.name === e.target.value)
                            setNewSubscription({
                              ...newSubscription,
                              name: e.target.value,
                              price: selected ? selected.price.toString() : '',
                              category: selected ? selected.category : 'Streaming'
                            })
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione um serviço</option>
                          {predefinedServices.map(service => (
                            <option key={service.name} value={service.name}>
                              {service.name} - € {service.price}
                            </option>
                          ))}
                          <option value="custom">Outro serviço...</option>
                        </select>
                      </div>

                      {newSubscription.name === 'custom' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome Personalizado
                          </label>
                          <input
                            type="text"
                            value={newSubscription.name}
                            onChange={(e) => setNewSubscription({...newSubscription, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nome do serviço"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preço Mensal (€)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={newSubscription.price}
                          onChange={(e) => setNewSubscription({...newSubscription, price: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Próxima Renovação
                        </label>
                        <input
                          type="date"
                          value={newSubscription.renewalDate}
                          onChange={(e) => setNewSubscription({...newSubscription, renewalDate: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={addSubscription}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setShowAddForm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de Subscrições */}
                {subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <Tv className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma subscrição cadastrada
                    </h3>
                    <p className="text-gray-600">
                      Adicione seus serviços de streaming para começar a controlar seus gastos
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {subscriptions.map(subscription => (
                      <div key={subscription.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`${subscription.color} p-2 rounded-lg`}>
                            {getIcon(subscription.icon)}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{subscription.name}</h3>
                            <p className="text-sm text-gray-600">
                              Renova em {new Date(subscription.renewalDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              € {subscription.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">por mês</p>
                          </div>
                          <button
                            onClick={() => removeSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dicas de Economia */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Dicas de Economia
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {economyTips.map((tip, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-medium text-gray-900 mb-1">{tip.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{tip.description}</p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        {tip.savings}
                      </span>
                    </div>
                  ))}
                </div>

                {subscriptions.length > 2 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-blue-900">Sugestão Personalizada</h4>
                    </div>
                    <p className="text-sm text-blue-800">
                      Com {subscriptions.length} serviços ativos, você poderia economizar até € {(totalMonthly * 0.4).toFixed(2)}/mês 
                      compartilhando contas familiares!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}